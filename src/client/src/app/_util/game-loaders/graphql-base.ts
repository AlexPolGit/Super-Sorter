import { GraphQLClient } from 'graphql-request'
import { BaseLoader } from './base-loader';

export abstract class GraphQLLoader extends BaseLoader {
    abstract client: GraphQLClient;

    constructor() {
        super();
    }

    runGraphQLQuery(document: string) {
        return this.client.request(document);
    }
}
