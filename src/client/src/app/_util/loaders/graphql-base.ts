import { GraphQLClient } from 'graphql-request'
import { SortableObjectLoader } from './sortable-object-loader';

export abstract class GraphQLLoader extends SortableObjectLoader {
    abstract client: GraphQLClient;

    runQuery(document: string) {
        return this.client.request(document);
    }
}
