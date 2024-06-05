import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebService } from '../_services/web-service';
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
    sessionType: string = '';
    sessionName: string = '';
    lastChoice: SortableObject | null = null;
    currentTab: number = 1;
    gameDone: boolean = false;

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
                this.webService.getSessionData(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                    this.sessionType = sessionData.type;
                    this.sessionName = sessionData.name;

                    if (this.sessionType == 'anilist-character') {
                        this.anilistWebService.getCharacters(sessionData.items).then((chars: AnilistCharacterSortable[]) => {
                            this.sortables = chars;
                            this.setupRound(sessionData);
                        });
                    }
                    else if (this.sessionType == 'anilist-staff') {
                        this.anilistWebService.getStaff(sessionData.items).then((staff: AnilistStaffSortable[]) => {
                            this.sortables = staff;
                            this.setupRound(sessionData);
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

    setupRound(sessionData: SessionData) {  
        if (!sessionData.options) {
            this.gameDone = true;
            this.currentTab = 2;
        }
        else if (sessionData.options) {
            this.gameDone = false;
            let right = sessionData.options.itemA;
            let left = sessionData.options.itemB;
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

    pickLeft() {
        this.sendAnswer(false);
        // this.lastChoice = this.leftItem;
        this.openSnackBar(`Selected ${this.leftItem.getDisplayName()}`);
    }

    pickRight() {
        this.sendAnswer(true);
        // this.lastChoice = this.rightItem;
        this.openSnackBar(`Selected ${this.rightItem.getDisplayName()}`);
    }

    deleteLeft() {
        this.sendDelete(this.leftItem.getRepresentor());
        // this.lastChoice = this.leftItem;
        this.openSnackBar(`Deleted ${this.leftItem.getDisplayName()}`);
    }

    deleteRight() {
        this.sendDelete(this.rightItem.getRepresentor());
        // this.lastChoice = this.rightItem;
        this.openSnackBar(`Deleted ${this.rightItem.getDisplayName()}`);
    }

    sendAnswer(answer: boolean) {
        if (this.gameParams) {
            this.webService.sendAnswer(this.gameParams.sessionId, this.leftItem.getRepresentor(), this.rightItem.getRepresentor(), answer).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData);
            });
        }
    }

    undoPick() {
        if (this.gameParams) {
            if (this.lastChoice) {
                this.openSnackBar(`Undid ${this.lastChoice.getDisplayName()}.`);
                this.lastChoice = null;
            }

            this.webService.undoAnswer(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                this.currentTab = 1;
                this.setupRound(sessionData);
            });
        }
    }

    sendDelete(toDelete: string) {
        if (this.gameParams) {
            this.webService.deleteItem(this.gameParams.sessionId, toDelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData);
            });
        }
    }

    sendUndelete(toDelete: string) {
        if (this.gameParams) {
            this.webService.undeleteItem(this.gameParams.sessionId, toDelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData);
            });
        }
    }

    getSession(): string {
        return this.gameParams ? this.gameParams.sessionId : "";
    }
}
