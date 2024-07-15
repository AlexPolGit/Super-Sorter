import { Component } from '@angular/core';
import { NewGameTypeComponent } from '../new-game-type.component';
import { AnilistMediaUserListLoader } from 'src/app/_util/data-loaders/anilist-media-user-list-loader';
import { AnilistMediaFaveListLoader } from 'src/app/_util/data-loaders/anilist-media-fave-list-loader';
import { AnilistMediaIdLoader } from 'src/app/_util/data-loaders/anilist-media-id-loader';

@Component({
    selector: 'app-new-anilist-media',
    templateUrl: './new-anilist-media.component.html',
    styleUrl: './new-anilist-media.component.scss'
})
export class NewAnilistMediaComponent extends NewGameTypeComponent {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-media-textbox-placeholder:Enter anime IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-media-textbox-label:Media IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-media-textbox-button-name:Load Media`;

    anilistMediaUserListLoader = this.gameDataService.getDataLoader(AnilistMediaUserListLoader.identifier) as AnilistMediaUserListLoader;
    anilistMediaFaveListLoader = this.gameDataService.getDataLoader(AnilistMediaFaveListLoader.identifier) as AnilistMediaFaveListLoader;
    anilistMediaIdLoader = this.gameDataService.getDataLoader(AnilistMediaIdLoader.identifier) as AnilistMediaIdLoader;
}
