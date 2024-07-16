import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { SpotifyArtistSortableData } from "@sorter/api/src/objects/sortables/spotify-artist.js";
import { splitArrayIntoBatches } from "../../../util/logic.js";
import { getRequest, postRequest } from "../../../util/web.js";
import { getEnvironmentVariable } from "../../../util/env.js";
import { BaseException } from "../../exceptions/base.js";
import { BaseLoader } from "../base-loader.js";

export class SpotifyQueryException extends BaseException {
    constructor(error: any) {
        super("INTERNAL_SERVER_ERROR", `Query to Spotify failed: "${error}"`);
    }
}

export interface Track {
    id: string;
    name: string;
    uri: string;
    is_local: boolean;
    artists: TrackArtist[];
    album: Album;
    preview_url: string | null;
    duration_ms: number;
    explicit: boolean;
}

export interface TrackArtist {
    id: string;
    name: string;
}

export interface Album {
    id: string;
    images: AlbumImage[];
}

export interface AlbumImage {
    url: string;
    height: number;
    width: number;
}

export interface ArtistData {
    artists: Artist[];
}

export interface Artist {
    id: string;
    name: string;
    images: ArtistImage[];
}

export interface ArtistImage {
    url: string;
    height: number;
    width: number;
}

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

let CLIENT_ID = getEnvironmentVariable("SPOTIFY_CLIENT_ID");
let CLIENT_SECRET = getEnvironmentVariable("SPOTIFY_CLIENT_SECRET");
let ACCESS_TOKEN: string | null = null;
let TOKEN_EXPIRY: number | null = null;

async function generateAccessToken() {
    if (accessTokenHasExpired()) {
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        let tokenResponse = await postRequest(
            SPOTIFY_TOKEN_URL,
            params,
            {
                "Authorization": "Basic " + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            }
        ) as {
            access_token: string,
            expires_in: string
        };
    
        ACCESS_TOKEN = tokenResponse.access_token;
        TOKEN_EXPIRY = Date.now() + (parseFloat(tokenResponse.expires_in) - 60);
        console.log(`Generated new Spotify access token. Expiry: ${TOKEN_EXPIRY}`);
    }
}

function accessTokenHasExpired(): boolean {
    if (TOKEN_EXPIRY === null) {
        return true;
    }

    const now = Date.now();
    return now > TOKEN_EXPIRY;
}

generateAccessToken();

export abstract class SpotifyLoader extends BaseLoader {
    protected async runSpotifyQuery<ResultType>(endpoint: string): Promise<ResultType> {
        await generateAccessToken();

        const requestUrl = `${SPOTIFY_API_URL}/${endpoint}`;
        console.log(`Making request to Spotify API: ${requestUrl}`);
        return await getRequest(requestUrl, { Authorization: `Bearer ${ACCESS_TOKEN}` }).then(
            (result: ResultType) => {
                return result;
            },
            (error: any) => {
                throw new SpotifyQueryException(error);
            }
        );
    }

    /**
     * TODO
     *
     * @param artistIds - List of artist IDs.
     * @returns List of sortable objects containing artist data.
     */
    protected async populateArtists(trackArtists: string[]): Promise<SortableItemDto<SpotifyArtistSortableData>[]> {

        if (trackArtists.length === 0) {
            return [];
        }
        
        // Query Spotify for the non-local-file artists.
        // The local ones' details can just be made up from what info we have on them.
        let validArtistIds: string[] = [];
        let localArtistIds: string[] = [];
        trackArtists.forEach((trackArtist: string) => {
            if (trackArtist.startsWith("local-")) {
                localArtistIds.push(trackArtist);
            }
            else {
                validArtistIds.push(trackArtist);
            }
        });

        // Run query to get artists whose IDs are included in the input.
        let artistData = await this.multipleArtistQuery(validArtistIds.join(","));
        
        // For each artist found, create a SpotifyArtistSortable object.
        let artists: SortableItemDto<SpotifyArtistSortableData>[] = Array.from(artistData.artists, (artist: Artist) => {
            // Get image URL for the largest image.
            // If there are no images, leave the image as undefined.
            let maxHeight = 0;
            let maxHeightImage: string = "";

            if (artist.images.length > 0) {
                artist.images.forEach((image: ArtistImage) => {
                    if (image.height > maxHeight) {
                        maxHeight = image.height;
                        maxHeightImage = image.url;
                    }
                });
            }

            return {
                id: artist.id,
                data: {
                    name: artist.name,
                    imageUrl: maxHeightImage
                }
            }
        });

        // Create sortable artist objects out of local-file artists.
        localArtistIds.forEach((trackArtist: string) => {
            const localArtist: SortableItemDto<SpotifyArtistSortableData> = {
                id: trackArtist,
                data: {
                    name: trackArtist.split("-").slice(1).join(),
                    imageUrl: ""
                }
            }
            artists.push(localArtist);
        });

        return artists;
    }

    protected async multipleArtistQuery(idList: string): Promise<ArtistData> {
        const idBatches = splitArrayIntoBatches<string>(idList.split(","));
        let batches: Artist[][] = [];

        for (let i = 0; i < idBatches.length; i++) {
            idList = idBatches[i].join(",");
            const batch = await this.runSpotifyQuery<ArtistData>(`artists?ids=${idList}&locale=en_CA`);
            batches.push(batch.artists);
        }

        return {
            artists: batches.flat()
        }
    }
}
