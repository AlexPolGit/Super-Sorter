import { UserCookieService } from 'src/app/_services/user-cookie-service';
import { BaseLoader } from './base-loader';
import { WebService } from 'src/app/_services/web-service';

export abstract class SpotifyLoader extends BaseLoader {

    constructor(public webService: WebService, public userCookieService: UserCookieService) {
        super();
    }
}
