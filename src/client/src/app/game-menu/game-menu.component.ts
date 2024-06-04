import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebService } from '../_services/web-service';
import { GameResponse } from '../_objects/server/game-response';
import { SortableObject } from '../_objects/sortables/sortable';
import { AnilistCharacterSortable } from '../_objects/sortables/anilist-character';
import { SessionData } from '../_objects/server/session-data';
import { AnilistWebService } from '../_services/anilist-web-service';
import { AnilistStaffSortable } from '../_objects/sortables/anilist-staff';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface GameParameters {
    sessionId: string
}

export enum KEY_CODE {
    UP_ARROW = 38,
    DOWN_ARROW = 40,
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37
}

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.scss'
})
export class GameMenuComponent {

    gameParams: GameParameters | null = null;
    sortables: SortableObject[] = [];
    leftItem: SortableObject = new SortableObject();
    rightItem: SortableObject = new SortableObject();
    gameResults: SortableObject[] = [];
    sessionType: string = '';
    sessionName: string = '';
    lastChoice: SortableObject | null = null;
    currentTab: number = 1;

    constructor(
        private route: ActivatedRoute,
        private webService: WebService,
        private anilistWebService: AnilistWebService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit() { 
        this.route.queryParams.subscribe((params: any) => {
            this.gameParams = params as GameParameters;
            if (this.gameParams != null && this.gameParams.sessionId) {
                this.webService.getsessionData(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                    this.sessionType = sessionData.type;
                    this.sessionName = sessionData.name;

                    if (this.sessionType == 'anilist-character') {
                        this.anilistWebService.getCharacters(sessionData.items).then((chars: AnilistCharacterSortable[]) => {
                            this.sortables = chars;
                            
                            this.webService.restoreSession(sessionData.sessionId).subscribe((resp: GameResponse) => {
                                this.setupRound(resp);
                            });
                        });
                    }
                    else if (this.sessionType == 'anilist-staff') {
                        this.anilistWebService.getStaff(sessionData.items).then((staff: AnilistStaffSortable[]) => {
                            this.sortables = staff;
                            
                            this.webService.restoreSession(sessionData.sessionId).subscribe((resp: GameResponse) => {
                                this.setupRound(resp);
                            });
                        });
                    }
                    else {
                        throw new Error(`Invalid game type: ${this.sessionType}`);
                    }
                });
            }
            else {
                console.error("GAME SETTINGS PAGE NOT LOADED CORRECTLY. PARAMS:", params);
            }
        });
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key == "ArrowLeft") {
            this.pickLeft();
        }
        else if (event.key == "ArrowRight") {
            this.pickRight();
        }
        else if (event.key == "ArrowUp") {
            this.undoPick();
        }
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, undefined, {
            duration: 1000
        });
    }

    setupRound(gameResponse: GameResponse) {
        if (gameResponse.result) {
            this.anilistWebService.getCharacters(gameResponse.result).then((chars: AnilistCharacterSortable[]) => {
                this.gameResults = chars;
                this.currentTab = 2;
            });
        }
        else if (gameResponse.options.itemA !== null && gameResponse.options.itemB !== null) {
            let left = gameResponse.options.itemA;
            let right = gameResponse.options.itemB;
            this.currentTab = 1;

            this.sortables.forEach((item: SortableObject) => {
                if (item.id == left) {
                    this.leftItem = item;
                }
                if (item.id == right) {
                    this.rightItem = item;
                }
            });
        }
    }

    openLink(item: SortableObject) {
        let link = item.getLink();
        if (link) {
            window.open(link, "_blank");
        }
    }

    pickLeft() {
        this.sendAnswer(false);
        this.lastChoice = this.leftItem;
        this.openSnackBar(`Selected ${this.leftItem.getDisplayName()}`);
    }

    pickRight() {
        this.sendAnswer(true);
        this.lastChoice = this.rightItem;
        this.openSnackBar(`Selected ${this.rightItem.getDisplayName()}`);
    }

    sendAnswer(answer: boolean) {
        if (this.gameParams) {
            this.webService.sendAnswer(this.gameParams.sessionId, this.leftItem.getRepresentor(), this.rightItem.getRepresentor(), answer).subscribe((resp: GameResponse) => {
                this.setupRound(resp);
            });
        }
    }

    undoPick() {
        if (this.gameParams) {
            if (this.lastChoice) {
                this.openSnackBar(`Undid ${this.lastChoice.getDisplayName()}.`);
                this.lastChoice = null;
            }

            this.webService.undoAnswer(this.gameParams.sessionId).subscribe((resp: GameResponse) => {
                this.gameResults = [];
                this.currentTab = 1;
                this.setupRound(resp);
            });
        }
    }

    getSession(): string {
        return this.gameParams ? this.gameParams.sessionId : "";
    }
}
