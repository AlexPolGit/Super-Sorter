import { BaseLoader } from './base-loader';
import { WebService } from 'src/app/_services/web-service';

export abstract class SpotifyLoader extends BaseLoader {

    constructor(public webService: WebService) {
        super();
    }
}
