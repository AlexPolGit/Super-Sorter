import { BaseException } from "../../exceptions/base.js";
import { getRequest, postRequest } from "../../../util/web.js";
import { getEnvironmentVariable } from "../../../util/env.js";
import { BaseLoader } from "../base-loader.js";

export class SpotifyQueryException extends BaseException {
    constructor(error: any) {
        super("INTERNAL_SERVER_ERROR", `Query to Spotify failed: "${error}"`);
    }
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
}
