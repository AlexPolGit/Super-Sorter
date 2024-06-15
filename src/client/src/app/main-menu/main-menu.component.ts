import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameOption, VALID_GAME_TYPES } from '../_objects/game-option';
import { Router } from '@angular/router';
import { SessionService } from '../_services/session-service';
import { SessionData, SessionList, UpdateSession } from '../_objects/server/session-data';
import { MatDialog } from '@angular/material/dialog';
import { NewGameComponent, NewGameDialogInput, NewGameDialogOutput } from '../new-game/new-game.component';
import { SortableObject } from '../_objects/sortables/sortable';
import { InterfaceError } from '../_objects/custom-error';
import { CONFIRM_MODAL_HEIGHT, CONFIRM_MODAL_WIDTH, ConfirmationDialogComponent, ConfirmDialogInput, ConfirmDialogOutput } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportSessionComponent } from '../import-session/import-session.component';
import { FullExportObject } from '../_objects/export-gamestate';

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
        }
    ]

    sessionList: SessionList = {
        sessions: []
    };

    importData?: FullExportObject;

    constructor(
        private router: Router,
        private sessionService: SessionService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.sessionService.getSessions().subscribe((sessionList: SessionList) => {
            this.sessionList = sessionList;
        });
    }

    selectSession(event: any, session: SessionData) {
        this.router.navigate(['/game'], { queryParams: { sessionId: session.sessionId } });
    }

    selectImportOption(event: any) {
        const importSessionDialogRef = this.dialog.open(ImportSessionComponent, {
            height: IMPORT_SESSION_MODAL_HEIGHT,
            width: IMPORT_SESSION_MODAL_WIDTH
        });

        importSessionDialogRef.afterClosed().subscribe((result: FullExportObject) => {
            console.log(`New game data from dialog:`, result);
            if (result) {
                // Angular Material modals are broken so we need to do it like this.
                this.importData = result;
                (document.getElementById(result.type) as HTMLElement).click();
            }
        });
    }

    selectNewGameOption(event: any, gameType: string) {
        let inputData: NewGameDialogInput;

        if (!VALID_GAME_TYPES.includes(gameType)) {
            throw new InterfaceError(`Invalid game type: ${gameType}`);
        }
        else {
            inputData = {
                gameType: gameType,
                importData: this.importData
            };
        }

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

    startNewGame(name: string, type: string, data: SortableObject[], algorithm: string, scrambleInput: boolean, importedState?: FullExportObject) {
        let items: string[] = [];
        data.forEach((item: SortableObject) => {
            items.push(item.getRepresentor());
        });

        this.sessionService.createSession(name, type, items, algorithm, scrambleInput).subscribe((sessionData: SessionData) => {
            if (importedState) {
                let update: UpdateSession = {
                    deleted: importedState.deleted,
                    history: importedState.history,
                    deletedHistory: importedState.deletedHistory,
                    algorithm: algorithm, // Not importedState.algorithm since NewGameComponent handles that. 
                    seed: importedState.seed
                };
    
                this.sessionService.updateSession(sessionData.sessionId, update).subscribe(() => {
                    this.router.navigate(['/game'], { queryParams: { sessionId: sessionData.sessionId } });
                });
            }
            else {
                this.router.navigate(['/game'], { queryParams: { sessionId: sessionData.sessionId } });
            }
        });
    }

    deleteSession(session: SessionData) {
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
                this.sessionService.deleteSession(session.sessionId).subscribe((sessionList: SessionList) => {
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
