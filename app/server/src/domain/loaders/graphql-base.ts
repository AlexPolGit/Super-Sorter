import { GraphQLClient } from 'graphql-request'
import { BaseLoader } from './base-loader.js';

export abstract class GraphQLLoader extends BaseLoader {
    abstract client: GraphQLClient;

    runGraphQLQuery<T>(document: string): Promise<T> {
        return this.client.request<T>(document);
    }
}
