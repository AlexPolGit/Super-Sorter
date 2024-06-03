import { Component } from '@angular/core';
import { GameOption } from '../_objects/game-option';
import { Router } from '@angular/router';
import { WebService } from '../_services/web-service';
import { SessionData, SessionList } from '../_objects/server/session-data';
import { MatDialog } from '@angular/material/dialog';
import { NewGameComponent, NewGameDialogInput, NewGameDialogOutput } from '../new-game/new-game.component';
import { GameResponse } from '../_objects/server/game-response';
import { AnilistFavouriteCharacterLoader } from '../_util/loaders/anilist-favourite-character-loader';
import { SortableObject } from '../_objects/sortables/sortable';
import { CookieService } from 'ngx-cookie-service';
import { AnilistCharacter } from '../_objects/sortables/anilist-character';

export const MODAL_HEIGHT = "80%";
export const MODAL_WIDTH = "90%";

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {
    gameOptions: GameOption[] = [
        {
            id: 'anilist-character',
            displayName: 'Anilist Character',
            image: 'anilist-character.png'
        },
        // {
        //     id: 'anilist-staff',
        //     displayName: 'Anilist Staff',
        //     image: 'anilist-character.png'
        // },
        // {
        //     id: 'anilist-anime',
        //     displayName: 'Anilist Anime',
        //     image: 'anilist-character.png'
        // },
        // {
        //     id: 'general-character',
        //     displayName: 'General Character',
        //     image: 'anilist-character.png'
        // }
    ]

    sessionList: SessionList = {
        sessions: []
    };

    constructor(private router: Router, private webService: WebService, public dialog: MatDialog, private cookies: CookieService) {
        this.webService.getSessions().subscribe((resp: SessionList) => {
            this.sessionList = resp;
        });
    }

    selectSession(event: any, session: SessionData) {
        this.router.navigate(['/game'], { queryParams: { sessionId: session.sessionId } });
    }

    selectNewGameOption(event: any, gameOption: GameOption) {
        let inputData: NewGameDialogInput = {
            gameType: gameOption.id,
            characterReader: new AnilistFavouriteCharacterLoader()
        };

        const dialogRef = this.dialog.open(NewGameComponent, {
            data: inputData,
            height: MODAL_HEIGHT,
            width: MODAL_WIDTH
        });

        dialogRef.afterClosed().subscribe((result: NewGameDialogOutput | undefined) => {
            console.log(`Dialog result: ${result}`);
            if (result) {
                this.startNewGame(result.name, gameOption.id, result.data);
            }
        });
    }

    startNewGame(name: string, type: string, data: SortableObject[]) {
        let items: string[] = [];
        data.forEach((item: SortableObject) => {
            items.push(item.getRepresentor());
        });

        this.webService.createSession(name, type, items).subscribe((resp: GameResponse) => {
            ////// HACK LOL //////

            data.forEach(item => {
                let anilistChar = item as AnilistCharacter;
                this.cookies.set(anilistChar.id, anilistChar.imageUrl as string);
            });

            //////////////////////
            this.router.navigate(['/game'], { queryParams: { sessionId: resp.sessionId } });
        });
    }
}
