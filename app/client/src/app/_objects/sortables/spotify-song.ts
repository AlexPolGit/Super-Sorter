import { SortableItemDto, SortableItemTypes } from "@sorter/api/src/objects/sortable";
import { SortableObject } from "./sortable";
import { SpotifyArtistSortable } from "./spotify-artist";
import { SpotifySongSortableData } from "@sorter/api/src/objects/sortables/spotify-song";

const LOCAL_FILE_REGEX = new RegExp("^local-");
const MISSING_SONG_IMAGE_DEFAULT = "assets/spotify-empty-song.jpg";

export class SpotifySongSortable extends SortableObject {
    override type = "spotify-songs" as SortableItemTypes;
    name: string;
    local: boolean;
    artists: SpotifyArtistSortable[];
    artistIds?: string[];
    previewUrl?: string;
    duration?: number;
    explicit?: boolean;

    constructor(dto: SortableItemDto<SpotifySongSortableData>) {
        super({
            id: dto.id,
            data: {
                imageUrl: dto.data.imageUrl !== "" ? dto.data.imageUrl : MISSING_SONG_IMAGE_DEFAULT
            }
        });
        this.name = dto.data.name;
        this.artists = dto.data.artists ? dto.data.artists.map(artist => new SpotifyArtistSortable(artist)) : [];
        this.previewUrl = dto.data.previewUrl;
        this.artistIds = dto.data.artistIds;
        this.local = dto.data.local;
        this.duration = dto.data.duration;
        this.explicit = dto.data.explicit;
    }

    override getDisplayName(): string {
        if (this.artists.length > 0) {
            return `${this.artists[0].getDisplayName()} - ${this.name}`
        }
        else {
            return this.name;
        }
    }

    override getDetailedDisplayName(): string {
        let duration = "";
        if (this.duration) {
            let totalSec = this.duration / 1000;
            let min = Math.floor(totalSec / 60);
            let sec = Math.round(totalSec - (min * 60));
            if (sec === 60) {
                sec = 0;
                min += 1;
            }
            duration = ` [${min}:${sec < 10 ? "0" + sec : sec }]`;
        }

        let explicit = "";
        if (this.explicit !== undefined && this.explicit === true) {
            explicit = " [🔞]";
        }

        let local = "";
        if (this.local !== undefined && this.local === true) {
            local = ` [${$localize`:@@spotify-song-local-file:local file`}]`;
        }

        return `${this.getDisplayName()}${duration}${explicit}${local}`
    }

    override getLink(): string | null {
        let match = this.id.match(LOCAL_FILE_REGEX);
        if (match && match.length > 0) {
            return encodeURI(`https://www.youtube.com/results?search_query=${this.name}+${this.artists.map(a => a.name).join('+')}`);
        }
        else {
            return `https://open.spotify.com/track/${this.id}`;
        }
    }

    override getAudio(): string | null {
        return this.previewUrl ? this.previewUrl : null;
    }
}
