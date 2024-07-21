import { SortableItemDto, SortableItemTypes, SteamGameSortableData } from "@sorter/api";
import { getEnvironmentVariable } from "../../../util/env.js";
import { SORTABLE_ITEM_MANAGER } from "../../../routes/common.js";
import { getRequest, HttpResponseException } from "../../../util/web.js";
import { BaseException } from "../../exceptions/base.js";
import { BaseLoader } from "../base-loader.js";

export class SteamQueryException extends BaseException {
    constructor(error: any) {
        super("INTERNAL_SERVER_ERROR", `Query to Steam failed: "${error}"`);
    }
}

export class SteamUserNotFoundException extends BaseException {
    constructor(id: any) {
        super("NOT_FOUND", `Steam user not found: "${id}"`);
    }
}

export interface ResolveVanityUrlResponse {
    response: {
        success: number;
        message?: "No match";
        steamid?: string;
    }
}

export interface AppDetailsResponse { [appId: string]: AppDetails };

export interface AppDetails {
    success: boolean;
    data: AppData;
}

export interface AppData {
    type: "game" | "dlc" | "demo" | "advertising" | "mod" | "video";
    name: string;
    steam_appid: number;
    required_age: number;
    is_free: boolean;
    developers?: string[];
    publishers?: string[];
    platforms?: {
        windows: boolean;
        mac: boolean;
        linux: boolean;
    };
    categories?: {
        id: number;
        description: string;
    }[];
    genres?: {
        id: number;
        description: string;
    }[];
    release_date?: {
        coming_soon: boolean;
        date: string;
    };
}

export interface UserGameList {
    response: {
        game_count: number;
        games: UserGame[];
    };
}

export interface UserGame {
    appid: number;
    name: string;
    playtime_forever: number;
    rtime_last_played: number;
}

const STEAM_API_URL = "http://api.steampowered.com";
const STEAM_APIS = {
    GetOwnedGames: "IPlayerService/GetOwnedGames/v0001",
    GetAppList: "ISteamApps/GetAppList/v0002",
    ResolveVanityURL: "ISteamUser/ResolveVanityURL/v0001"
}

const STEAM_STORE_API_URL = "http://store.steampowered.com/api";
const STEAM_STORE_APIS = {
    appdetails: "appdetails"
}

export type SteamApis = "GetOwnedGames" | "GetAppList" | "ResolveVanityURL";
export type SteamStoreApis = "appdetails";

let STEAM_DEV_KEY = getEnvironmentVariable("STEAM_DEV_KEY");

export abstract class SteamLoader extends BaseLoader {

    readonly STEAM_GAME_QUERY_RETRIES = 3;
    readonly STEAM_GAME_QUERY_SLEEP = 2000;

    protected async runSteamApiQuery<ResultType>(api: SteamApis, parameters: string[], retries: number = 0, sleep: number = 2000): Promise<ResultType> {
        const paramString = this.generateParamString(parameters);
        const requestUrl = `${STEAM_API_URL}/${STEAM_APIS[api]}?format=json&key=${STEAM_DEV_KEY}${paramString}`;
        return await getRequest(requestUrl, {}, retries, sleep);
    }

    protected async runSteamStoreApiQuery<ResultType>(api: SteamStoreApis, parameters: string[], retries: number = 0, sleep: number = 2000): Promise<ResultType> {
        const paramString = this.generateParamString(parameters);
        const requestUrl = `${STEAM_STORE_API_URL}/${STEAM_STORE_APIS[api]}?format=json&key=${STEAM_DEV_KEY}${paramString}`;
        return await getRequest(requestUrl, {}, retries, sleep);
    }

    private generateParamString(parameters: string[]): string {
        let paramString = parameters.join("&");
        if (paramString.length > 0) {
            paramString = "&" + paramString;
        }
        return paramString;
    }

    protected async saveItemsToCache(items: SortableItemDto<SteamGameSortableData>[]) {
        await SORTABLE_ITEM_MANAGER.saveItemsToDb(items, SortableItemTypes.STEAM_GAME);
    }

    protected async getItemsFromCache(keys: string[]) {
        return await SORTABLE_ITEM_MANAGER.getItemsFromDbOrCache(keys, SortableItemTypes.STEAM_GAME);
    }

    protected async getSteamIdFromVanityUrl(vanityUrlName: string) {
        const response = await this.runSteamApiQuery<ResolveVanityUrlResponse>("ResolveVanityURL", [`vanityurl=${vanityUrlName}`]);
        if (response.response.success === 1) {
            return response.response.steamid as string;
        }
        else if (response.response.message === "No match") {
            throw new SteamUserNotFoundException(vanityUrlName);
        }
        else {
            throw new SteamQueryException(`Could not get steam`);
        }
    }

    protected async getSteamGamesFromUserLibrary(userLibrary: { [id: string]: UserGame }): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const cacheResult = await this.getItemsFromCache(Object.keys(userLibrary)) as { [id: string]: SortableItemDto<SteamGameSortableData> | null };
        let games: SortableItemDto<SteamGameSortableData>[] = [];
        let toCache: SortableItemDto<SteamGameSortableData>[] = [];

        for(const id in cacheResult) {
            if (cacheResult[id] === null) {
                const game = await this.getGameFromSteam(id, userLibrary);
                games.push(game);
                toCache.push(game);
                console.log(`Adding Steam game to DB: ${id}`);
                await new Promise(f => setTimeout(f, 200));
            }
            else {
                games.push(cacheResult[id]);
            }
        }

        await this.saveItemsToCache(toCache);
        return games;
    }

    protected async getGameFromSteam(appId: string, userLibrary: { [id: string]: UserGame }) {
        try {
            const response = await this.runSteamStoreApiQuery<AppDetailsResponse>("appdetails", [`appids=${appId}`], this.STEAM_GAME_QUERY_RETRIES, this.STEAM_GAME_QUERY_SLEEP);
            const appDetails = response[`${appId}`];

            if (appDetails.success) {
                return this.parseAppData(appDetails.data, userLibrary[appId]);
            }
            else {
                return this.parseWithoutAppData(userLibrary[appId]);
            }
        }
        catch (e: any) {
            if (e instanceof HttpResponseException && e.response.status === 429) {
                console.warn(`Got a 429 error for Steam app "${appId}", trying again.`);
                throw new SteamQueryException(e);
            }
            else {
                throw e;
            }
        }
    }

    protected parseAppData(appData: AppData, userDetails?: UserGame): SortableItemDto<SteamGameSortableData> {
        return {
            id: `${appData.steam_appid}`,
            data: {
                imageUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${appData.steam_appid}/library_600x900_2x.jpg`,
                name: appData.name,
                type: appData.type,
                requiredAge: appData.required_age,
                free: appData.is_free,
                developers: appData.developers,
                publishers: appData.publishers,
                platforms: appData.platforms ? {
                    windows: appData.platforms.windows,
                    mac: appData.platforms.mac,
                    linux: appData.platforms.linux
                } : undefined,
                categories: appData.categories ? appData.categories.map(cat => cat.description): undefined,
                genres: appData.genres ? appData.genres.map(gen => gen.description): undefined,
                userDetails: userDetails ? {
                    playtime: userDetails.playtime_forever,
                    lastPlayed: userDetails.rtime_last_played
                }: undefined,
                completeData: true,
                lastUpdated: Date.now()
            }
        };
    }

    protected parseWithoutAppData(userDetails: UserGame): SortableItemDto<SteamGameSortableData>  {
        return {
            id: `${userDetails.appid}`,
            data: {
                imageUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${userDetails.appid}/library_600x900_2x.jpg`,
                name: userDetails.name,
                userDetails: {
                    playtime: userDetails.playtime_forever,
                    lastPlayed: userDetails.rtime_last_played
                },
                completeData: false,
                lastUpdated: Date.now()
            }
        }
    }
}
