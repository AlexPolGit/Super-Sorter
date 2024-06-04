import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebService } from '../_services/web-service';
import { GameResponse } from '../_objects/server/game-response';
import { SortableObject } from '../_objects/sortables/sortable';
import { AnilistCharacterSortable } from '../_objects/sortables/anilist-character';
import { SessionData } from '../_objects/server/session-data';
import { AnilistWebService } from '../_services/anilist-web-service';
import { AnilistStaffSortable } from '../_objects/sortables/anilist-staff';

export interface GameParameters {
    sessionId: string
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

    constructor(
        private route: ActivatedRoute,
        private webService: WebService,
        private anilistWebService: AnilistWebService
    ) {}

    ngOnInit() { 
        this.route.queryParams.subscribe((params: any) => {
            this.gameParams = params as GameParameters;
            if (this.gameParams != null && this.gameParams.sessionId) {
                this.webService.getsessionData(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                    this.sessionType = sessionData.type;

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

    setupRound(gameResponse: GameResponse) {
        if (gameResponse.options.itemA !== null && gameResponse.options.itemB !== null) {
            let left = gameResponse.options.itemA;
            let right = gameResponse.options.itemB;

            this.sortables.forEach((item: SortableObject) => {
                if (item.id == left) {
                    this.leftItem = item;
                }
                if (item.id == right) {
                    this.rightItem = item;
                }
            });
        }
        else if (gameResponse.result) {
            this.anilistWebService.getCharacters(gameResponse.result).then((chars: AnilistCharacterSortable[]) => {
                this.gameResults = chars;
            });
        }
    }

    pickLeft() {
        this.sendAnswer(false);
    }

    pickRight() {
        this.sendAnswer(true);
    }

    sendAnswer(answer: boolean) {
        if (this.gameParams) {
            this.webService.sendAnswer(this.gameParams.sessionId, answer).subscribe((resp: GameResponse) => {
                this.setupRound(resp);
            });
        }
    }

    undoPick() {
        if (this.gameParams) {
            this.webService.undoAnswer(this.gameParams.sessionId).subscribe((resp: GameResponse) => {
                this.setupRound(resp);
            });
        }
    }

    getSession(): string {
        return this.gameParams ? this.gameParams.sessionId : "";
    }
}
