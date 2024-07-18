import { GraphQLClient } from "graphql-request";
import { BaseException } from "../../exceptions/base.js";
import { GraphQLLoader } from "../graphql-base.js";

export class AnilistQueryException extends BaseException {
    status: number;

    constructor(error: any, status: number) {
        super("INTERNAL_SERVER_ERROR", `Query to Anilist failed: "${error}"`);
        this.status = status;
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
                throw new AnilistQueryException(error, error.response.status);
            }
        );
    }

    protected runUsernameQuery<ResultType>(query: string): Promise<ResultType> {
        return this.runAnilistQuery<ResultType>(query).then(
            (graphQLResponse: any) => {
                return graphQLResponse;
            },
            (error: any) => {
                if (error instanceof AnilistQueryException) {
                    if (error.status === 404) {
                        throw new AnilistUserNotFoundException()
                    }
                    else {
                        throw error;
                    }
                }
                else {
                    throw error;
                }
            }
        );
    }
}
