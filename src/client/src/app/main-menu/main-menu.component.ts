import { Component } from '@angular/core';
import { GameOption, VALID_GAME_TYPES } from '../_objects/game-option';
import { Router } from '@angular/router';
import { SessionService } from '../_services/session-service';
import { SessionData, SessionList } from '../_objects/server/session-data';
import { MatDialog } from '@angular/material/dialog';
import { NewGameComponent, NewGameDialogInput, NewGameDialogOutput } from '../new-game/new-game.component';
import { SortableObject } from '../_objects/sortables/sortable';
import { InterfaceError } from '../_objects/custom-error';
import { LoggerService } from '../_services/logger-service';

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
            type: 'generic-items',
            displayName: $localize`:@@main-menu-tile-generic-items:Generic Items`,
            image: 'anilist-character.png'
        },
        {
            type: 'anilist-character',
            displayName: $localize`:@@main-menu-tile-anilist-character:Anilist Character`,
            image: 'anilist-character.png'
        },
        {
            type: 'anilist-staff',
            displayName: $localize`:@@main-menu-tile-anilist-staff:Anilist Staff`,
            image: 'anilist-character.png'
        }
    ]

    sessionList: SessionList = {
        sessions: []
    };

    constructor(
        private logger: LoggerService,
        private router: Router,
        private sessionService: SessionService,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.sessionService.getSessions().subscribe((resp: SessionList) => {
            this.sessionList = resp;
        });
    }

    selectSession(event: any, session: SessionData) {
        this.router.navigate(['/game'], { queryParams: { sessionId: session.sessionId } });
    }

    selectNewGameOption(event: any, gameOption: GameOption) {
        let inputData: NewGameDialogInput;

        if (!VALID_GAME_TYPES.includes(gameOption.type)) {
            throw new InterfaceError(`Invalid game type: ${gameOption.type}`);
        }
        else {
            inputData = {
                gameType: gameOption.type
            };
        }

        const dialogRef = this.dialog.open(NewGameComponent, {
            data: inputData,
            height: MODAL_HEIGHT,
            width: MODAL_WIDTH
        });

        dialogRef.afterClosed().subscribe((result: NewGameDialogOutput | undefined) => {
            this.logger.debug(`New game data from dialog: ${result}`);
            if (result) {
                this.startNewGame(result.name, gameOption.type, result.startingData, result.algorithm, result.scrambleInput);
            }
        });
    }

    startNewGame(name: string, type: string, data: SortableObject[], algorithm: string, scrambleInput: boolean) {
        let items: string[] = [];
        data.forEach((item: SortableObject) => {
            items.push(item.getRepresentor());
        });

        this.sessionService.createSession(name, type, items, algorithm, scrambleInput).subscribe((sessionData: SessionData) => {
            this.router.navigate(['/game'], { queryParams: { sessionId: sessionData.sessionId } });
        });
    }
}
