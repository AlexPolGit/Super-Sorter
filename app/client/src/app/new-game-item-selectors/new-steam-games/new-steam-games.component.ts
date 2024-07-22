import { Component } from '@angular/core';
import { NewGameTypeComponent } from '../new-game-type.component';
import { SteamUserGameLoader } from 'src/app/_data-loaders/steam-user-game-loader';

@Component({
    selector: 'app-new-steam-games',
    templateUrl: './new-steam-games.component.html',
    styleUrl: './new-steam-games.component.scss'
})
export class NewSteamGamesComponent extends NewGameTypeComponent {
    steamUserGameLoader = this.gameDataService.getDataLoader(SteamUserGameLoader.identifier) as SteamUserGameLoader;
}
