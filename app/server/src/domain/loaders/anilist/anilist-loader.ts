import { GraphQLClient } from "graphql-request";
import { BaseException } from "../../exceptions/base.js";
import { GraphQLLoader } from "../graphql-base.js";

export class AnilistQueryException extends BaseException {
    constructor(error: any) {
        super("INTERNAL_SERVER_ERROR", `Query to Anilist failed: "${error}"`);
    }
}

export class AnilistUserNotFoundException extends BaseException {
    constructor() {
        super("NOT_FOUND", `Anilist user not found.`);
    }
}

export abstract class AnilistLoader extends GraphQLLoader {
    private ANILIST_PUBLIC_ENDPOINT = 'https://graphql.anilist.co';
    protected client: GraphQLClient;

    constructor() {
        super();
        this.client = new GraphQLClient(this.ANILIST_PUBLIC_ENDPOINT, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    }

    protected runAnilistQuery<ResultType>(query: string): Promise<ResultType> {
        return this.runGraphQLQuery<ResultType>(query).then(
            (result: ResultType) => {
                return result;
            },
            (error: any) => {
                throw new AnilistQueryException(error);
            }
        );
    }

    protected runUsernameQuery<ResultType>(query: string): Promise<ResultType> {
        return this.runAnilistQuery<ResultType>(query).then(
            (graphQLResponse: any) => {
                return graphQLResponse;
            },
            (error: any) => {
                if (error.response.status === 404) {
                    throw new AnilistUserNotFoundException()
                }
                else {
                    throw new AnilistQueryException(error);
                }
            }
        );
    }
}
