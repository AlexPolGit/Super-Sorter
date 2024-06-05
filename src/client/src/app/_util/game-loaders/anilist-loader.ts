import { WebService } from "src/app/_services/web-service";
import { GraphQLLoader } from "./graphql-base";
import { GraphQLClient } from "graphql-request";

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
}
