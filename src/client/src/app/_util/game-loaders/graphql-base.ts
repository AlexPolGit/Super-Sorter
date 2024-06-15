import { GraphQLClient } from 'graphql-request'
import { BaseLoader } from './base-loader';
import { InterfaceError, UserError } from 'src/app/_objects/custom-error';

const ANILIST_GRAPHQL_ERROR_TEXT = $localize`:@@anilist-error-generic-desc:Could not get data from Anilist.`;
const ANILIST_GRAPHQL_ERROR_TITLE = $localize`:@@anilist-error-generic-title:Anilist Error`;

export abstract class GraphQLLoader extends BaseLoader {
    abstract client: GraphQLClient;

    async runGraphQLQuery<T>(document: string) {
        return await this.client.request<T>(document).catch((error: any) => {
            if (error.response.status === 400) {
                throw new UserError(
                    $localize`:@@anilist-error-bad-query-desc:The Anilist query has failed: ${error.message}:error:`,
                    $localize`:@@anilist-error-bad-query-title:Anilist Query Failed`,
                    400
                );
            }
            else {
                throw new InterfaceError(ANILIST_GRAPHQL_ERROR_TEXT, ANILIST_GRAPHQL_ERROR_TITLE);
            }
        });
    }

    async runUsernameQuery<ResultType>(query: string): Promise<ResultType> {
        return await this.runGraphQLQuery<ResultType>(query).then(
            (graphQLResponse: ResultType) => {
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
                else {
                    throw error;
                }
            }
        );
    }
}
