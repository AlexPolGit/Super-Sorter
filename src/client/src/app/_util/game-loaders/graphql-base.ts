import { GraphQLClient } from 'graphql-request'
import { BaseLoader } from './base-loader';

export abstract class GraphQLLoader extends BaseLoader {
    abstract client: GraphQLClient;

    runGraphQLQuery(document: string) {
        return this.client.request(document);
    }
}
