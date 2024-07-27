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

export interface UserGame {
    appid: number;
    name: string;
    playtime_forever: number;
    rtime_last_played?: number;
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
export const STEAM_GAME_QUERY_RETRIES = parseInt(getEnvironmentVariable("STEAM_GAME_QUERY_RETRIES", false, "3"));
export const STEAM_GAME_QUERY_SLEEP = parseInt(getEnvironmentVariable("STEAM_GAME_QUERY_SLEEP", false, "2000"));

let STEAM_DEV_KEY = getEnvironmentVariable("STEAM_DEV_KEY");

export abstract class SteamLoader extends BaseLoader {

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
        const toCache = (JSON.parse(JSON.stringify(items)) as SortableItemDto<SteamGameSortableData>[]).map(item => {
            delete item.data.userDetails;
            return item;
        });
        await SORTABLE_ITEM_MANAGER.saveItemsToDb(toCache, SortableItemTypes.STEAM_GAME);
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

    protected async getGameFromSteam(
        appId: string,
        userLibrary?: { [id: string]: UserGame },
        retries: number = STEAM_GAME_QUERY_RETRIES,
        sleep: number = STEAM_GAME_QUERY_SLEEP
    ) {
        try {
            const response = await this.runSteamStoreApiQuery<AppDetailsResponse>("appdetails", [`appids=${appId}`], retries, sleep);
            const appDetails = response[`${appId}`];

            if (userLibrary !== undefined) {
                if (appDetails.success) {
                    return this.parseAppData(appId, appDetails.data, userLibrary[appId]);
                }
                else {
                    return this.parseWithoutAppData(appId, userLibrary[appId]);
                }
            }
            else {
                if (appDetails.success) {
                    return this.parseAppData(appId, appDetails.data);
                }
                else {
                    throw new SteamQueryException(`No data to populate steam game data with.`);
                }
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

    // Need to pass ID here because an app can have more than one ID. This way we can save both version and not have to pull the same data every time.
    protected parseAppData(appId: string, appData: AppData, userDetails?: UserGame): SortableItemDto<SteamGameSortableData> {
        return {
            id: `${appId}`,
            data: {
                imageUrl: (appData.type === "game" || appData.type === "mod") ? `https://steamcdn-a.akamaihd.net/steam/apps/${appData.steam_appid}/library_600x900_2x.jpg` : "",
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
                releaseDate: appData.release_date?.date,
                userDetails: userDetails ? {
                    playtime: userDetails.playtime_forever,
                    lastPlayed: userDetails.rtime_last_played
                }: undefined,
                completeData: true,
                lastUpdated: Date.now()
            }
        };
    }

    // Need to pass ID here because an app can have more than one ID. This way we can save both version and not have to pull the same data every time.
    protected parseWithoutAppData(appId: string, userDetails: UserGame): SortableItemDto<SteamGameSortableData>  {
        return {
            id: `${appId}`,
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
