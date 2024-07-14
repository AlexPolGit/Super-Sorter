import { GraphQLClient } from "graphql-request";
import { BaseException } from "../../exceptions/base.js";
import { GraphQLLoader } from "../graphql-base.js";

export class AnilistQueryException extends BaseException {
    constructor(error: any) {
        super("INTERNAL_SERVER_ERROR", `Query to Anilist failed: "${error}"`);
    }
}

export abstract class AnilistLoader extends GraphQLLoader {
    ANILIST_PUBLIC_ENDPOINT = 'https://graphql.anilist.co';
    client: GraphQLClient;

    constructor() {
        super();
        this.client = new GraphQLClient(this.ANILIST_PUBLIC_ENDPOINT, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    }

    runAnilistQuery<ResultType>(query: string) {
        return this.runGraphQLQuery<ResultType>(query).then(
            (result: ResultType) => {
                return result;
            },
            (error: any) => {
                throw new AnilistQueryException(error);
            }
        );
    }
}
