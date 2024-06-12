import { BaseLoader } from './base-loader';
import { WebService } from 'src/app/_services/web-service';
import { AccountsService } from 'src/app/_services/accounts-service';

export abstract class SpotifyLoader extends BaseLoader {

    constructor(public webService: WebService, public accountsService: AccountsService) {
        super();
    }
}
