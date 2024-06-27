import { WebService } from "src/app/_services/web-service";
import { GraphQLLoader } from "./graphql-base";
import { GraphQLClient } from "graphql-request";
import { SortableObject } from "src/app/_objects/sortables/sortable";
import { InterfaceError, UserError } from "src/app/_objects/custom-error";

const ANILIST_GRAPHQL_ERROR_TEXT = $localize`:@@anilist-error-generic-desc:Could not get data from Anilist.`;
const ANILIST_GRAPHQL_ERROR_TITLE = $localize`:@@anilist-error-generic-title:Anilist Error`;

export enum UserMediaStatus {
    CURRENT,
    PLANNING,
    COMPLETED,
    DROPPED,
    PAUSED,
    REPEATING
}

export abstract class AnilistLoader extends GraphQLLoader {
    ANILIST_PUBLIC_ENDPOINT = 'https://graphql.anilist.co';
    client: GraphQLClient;

    constructor(public webService: WebService) {
        super();
        this.client = new GraphQLClient(this.ANILIST_PUBLIC_ENDPOINT, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    }

    abstract getUserList(userName: string, statuses: string[], anime: boolean, manga: boolean, mediaList: SortableObject[], page: number, tagPercentMinimum: number): Promise<SortableObject[]>;
    abstract getFavoriteList(userName: string, characterList: SortableObject[], page: number): Promise<SortableObject[]>;
    abstract getItemListFromIds(idList: number[], characterList: SortableObject[], page: number): Promise<SortableObject[]>;

    runAnilistQuery<ResultType>(query: string) {
        return this.runGraphQLQuery<ResultType>(query).then(
            (result: ResultType) => {
                return result;
            },
            (error: any) => {
                if (error.response.status === 400) {
                    throw new UserError(
                        $localize`:@@anilist-error-bad-query-desc:The Anilist query has failed: ${error.message}:error:`,
                        $localize`:@@anilist-error-bad-query-title:Anilist Query Failed`,
                        400
                    );
                }
                else if (error.response.status > 400) {
                    throw error;
                }
                else {
                    throw new InterfaceError(ANILIST_GRAPHQL_ERROR_TEXT, ANILIST_GRAPHQL_ERROR_TITLE);
                }
            }
        );
    }

    runUsernameQuery<ResultType>(query: string): Promise<ResultType> {
        return this.runAnilistQuery<ResultType>(query).then(
            (graphQLResponse: any) => {
                return graphQLResponse;
            },
            (error: any) => {
                if (error.response.status === 404) {
                    throw new UserError(
                        $localize`:@@anilist-error-missing-user-desc:This Anilist user does not exist.`,
                        $localize`:@@anilist-error-missing-user-title:Missing Anilist User`,
                        404
                    );
                }
                else if (error instanceof UserError) {
                    throw error;
                }
                else {
                    throw new InterfaceError(ANILIST_GRAPHQL_ERROR_TEXT, ANILIST_GRAPHQL_ERROR_TITLE);
                }
            }
        );
    }
}
