import { Component } from '@angular/core';
import { NewGameTypeComponent } from '../new-game-type.component';
import { SteamUserGameLoader } from 'src/app/_data-loaders/steam-user-game-loader';
import { SteamGameIdLoader } from 'src/app/_data-loaders/steam-game-id-loader';

@Component({
    selector: 'app-new-steam-games',
    templateUrl: './new-steam-games.component.html',
    styleUrl: './new-steam-games.component.scss'
})
export class NewSteamGamesComponent extends NewGameTypeComponent {
    steamUserGameLoader = this.gameDataService.getDataLoader(SteamUserGameLoader.identifier) as SteamUserGameLoader;
    steamGameIdLoader = this.gameDataService.getDataLoader(SteamGameIdLoader.identifier) as SteamGameIdLoader;

    textboxPlaceholder = $localize`:@@new-game-steam-game-textbox-placeholder:Enter game IDs or URLs seperated by newlines.`;
    textboxLabel = $localize`:@@new-game-steam-game-textbox-label:Game IDs/URLs`;
    textboxButtonName = $localize`:@@new-game-steam-game-textbox-button-name:Load Games`;
}
