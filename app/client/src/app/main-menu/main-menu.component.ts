import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AlgorithmTypes, SimpleSessionDto, SortableItemTypes } from '@sorter/api';
import { GameOption } from '../_objects/game-option';
import { SessionService } from '../_services/session-service';
import { NewGameComponent, NewGameDialogInput, NewGameDialogOutput } from '../new-game/new-game.component';
import { SortableObject } from '../_objects/sortables/sortable';
import { CONFIRM_MODAL_HEIGHT, CONFIRM_MODAL_WIDTH, ConfirmationDialogComponent, ConfirmDialogInput, ConfirmDialogOutput } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImportSessionComponent } from '../import-session/import-session.component';
import { SessionExportObject } from '../_objects/export-gamestate';

export const IMPORT_SESSION_MODAL_HEIGHT = "40%";
export const IMPORT_SESSION_MODAL_WIDTH = "90%";
export const NEW_SESSION_MODAL_HEIGHT = "80%";
export const NEW_SESSION_MODAL_WIDTH = "90%";

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
            image: 'generic-items.png'
        },
        {
            type: 'anilist-character',
            displayName: $localize`:@@main-menu-tile-anilist-character:Anilist Character`,
            image: 'anilist-character.png'
        },
        {
            type: 'anilist-staff',
            displayName: $localize`:@@main-menu-tile-anilist-staff:Anilist Staff`,
            image: 'anilist-staff.png'
        },
        {
            type: 'anilist-media',
            displayName: $localize`:@@main-menu-tile-anilist-media:Anilist Anime and Manga`,
            image: 'anilist-media.png'
        },
        {
            type: 'spotify-songs',
            displayName: $localize`:@@main-menu-tile-spotify-songs:Spotify Songs`,
            image: 'spotify-songs.png'
        },
        {
            type: 'steam-game',
            displayName: $localize`:@@main-menu-tile-steam-games:Steam Games`,
            image: 'steam-game.png'
        }
    ]

    sessionList: SimpleSessionDto[] = [];
    importData?: SessionExportObject;

    constructor(
        private router: Router,
        private sessionService: SessionService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.sessionService.getSessions().then((sessionList) => {
            this.sessionList = sessionList;
        });
    }

    selectSession(event: any, session: SimpleSessionDto) {
        this.router.navigate(['/game'], { queryParams: { sessionId: session.sessionId } });
    }

    selectImportOption(event: any) {
        const importSessionDialogRef = this.dialog.open(ImportSessionComponent, {
            height: IMPORT_SESSION_MODAL_HEIGHT,
            width: IMPORT_SESSION_MODAL_WIDTH
        });

        importSessionDialogRef.afterClosed().subscribe((result: SessionExportObject) => {
            console.log(`New game data from dialog:`, result);
            if (result) {
                // Angular Material modals are broken so we need to do it like this.
                this.importData = result;
                (document.getElementById(result.type) as HTMLElement).click();
            }
        });
    }

    selectNewGameOption(event: any, gameOption: GameOption) {
        let inputData: NewGameDialogInput;
        const gameType: SortableItemTypes = gameOption.type as SortableItemTypes;

        inputData = {
            gameType: gameType,
            importData: this.importData
        };

        const newGameDialogRef = this.dialog.open(NewGameComponent, {
            data: inputData,
            height: NEW_SESSION_MODAL_HEIGHT,
            width: NEW_SESSION_MODAL_WIDTH
        });

        newGameDialogRef.afterClosed().subscribe((result: NewGameDialogOutput | undefined) => {
            console.log(`New game data from dialog: ${result}`);
            if (result) {
                this.startNewGame(result.name, gameType, result.startingData, result.algorithm, result.scrambleInput, result.importedState);
            }
        });
    }

    startNewGame(name: string, type: SortableItemTypes, data: SortableObject[], algorithm: AlgorithmTypes, scrambleInput: boolean, importedState?: SessionExportObject) {
        let items: string[] = [];
        data.forEach((item: SortableObject) => {
            items.push(item.getRepresentor());
        });

        this.sessionService.createSession(name, type, items, algorithm, scrambleInput).then((sessionData) => {
            this.router.navigate(['/game'], { queryParams: { sessionId: sessionData.sessionId } });
        });
    }

    deleteSession(session: SimpleSessionDto) {
        let input: ConfirmDialogInput = {
            confirmationTitle: $localize`:@@main-menu-delete-session-confirm-title:Confirm Deletion`,
            confirmationText: $localize`:@@main-menu-delete-session-confirm-message:Are you sure you want to delete session "${session.name}:session-name:"?`
        };
        
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: input,
            height: CONFIRM_MODAL_HEIGHT,
            width: CONFIRM_MODAL_WIDTH
        });

        dialogRef.afterClosed().subscribe((result: ConfirmDialogOutput | undefined) => {
            console.log(`Confirmation data from dialog: ${result}`);
            if (result && result.choice == "confirm") {
                this.sessionService.deleteSession(session.sessionId).then((sessionList: SimpleSessionDto[]) => {
                    this.sessionList = sessionList;
                    this.openSnackBar($localize`:@@main-menu-delete-session-snackbar:Deleted session: ${session.name}:session-name:`);
                });
            }
        });
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, undefined, {
            duration: 2500
        });
    }
}
