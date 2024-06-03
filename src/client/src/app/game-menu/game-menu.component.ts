import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebService } from '../_services/web-service';
import { GameResponse } from '../_objects/server/game-response';
import { SortableObject } from '../_objects/sortables/sortable';
import { AnilistCharacter } from '../_objects/sortables/anilist-character';
import { SessionData } from '../_objects/server/session-data';
import { CookieService } from 'ngx-cookie-service';

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

    constructor(private route: ActivatedRoute, private webService: WebService, private cookies: CookieService) {}

    ngOnInit() { 
        this.route.queryParams.subscribe((params: any) => {
            this.gameParams = params as GameParameters;
            if (this.gameParams != null && this.gameParams.sessionId) {
                this.webService.getsessionData(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                    sessionData.items.forEach(item => {
                        this.sortables.push(new AnilistCharacter(item, this.cookies.get(item)));
                    });

                    this.webService.restoreSession(sessionData.sessionId).subscribe((resp: GameResponse) => {
                        this.setupGame(resp);
                    });
                });
            }
            else {
                console.error("GAME SETTINGS PAGE NOT LOADED CORRECTLY. PARAMS:")
                console.error(params)
            }
        });
    }

    setupGame(gameResponse: GameResponse) {
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
            gameResponse.result.forEach(result => {
                this.gameResults.push(new AnilistCharacter(result));
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
                this.setupGame(resp);
            });
        }
    }

    undoPick() {
        if (this.gameParams) {
            this.webService.undoAnswer(this.gameParams.sessionId).subscribe((resp: GameResponse) => {
                this.setupGame(resp);
            });
        }
    }

    getSession(): string {
        return this.gameParams ? this.gameParams.sessionId : "";
    }
}
