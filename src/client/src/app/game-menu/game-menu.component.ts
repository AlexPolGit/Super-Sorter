import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebService } from '../_services/web-service';
import { GameDataService } from '../_services/game-data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseLoader } from '../_util/game-loaders/base-loader';
import { SortableObject } from '../_objects/sortables/sortable';
import { SessionData } from '../_objects/server/session-data';
import { BaseParameters } from '../app.component';
import { InterfaceError } from '../_objects/custom-error';

export interface GameParameters extends BaseParameters {
    sessionId: string
}

export enum KEY_CODE {
    UP_ARROW = 38,
    DOWN_ARROW = 40,
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37
}

export interface Comparison {
    itemA: SortableObject;
    itemB: SortableObject;
    choice: SortableObject;
}

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.scss'
})
export class GameMenuComponent {

    gameParams: GameParameters | null = null;
    gameDataLoader: BaseLoader | null = null;

    sortableItems: SortableObject[] = [];
    sortableItemStrings: string[] = [];

    deletedItems: SortableObject[] = [];
    deletedItemStrings: string[] = [];

    history: Comparison[] = [];
    historyStrings: string[] = [];

    deletedHistory: Comparison[] = [];
    deletedHistoryStrings: string[] = [];

    lastChoice: Comparison | null = null;
    results: SortableObject[] = [];

    totalEstimate: number = 0;
    choicesMade: number = 0;

    leftItem: SortableObject = new SortableObject();
    rightItem: SortableObject = new SortableObject();

    sessionType: string = '';
    sessionName: string = '';

    currentTab: number = 1;
    gameDone: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private webService: WebService,
        private gameDataService: GameDataService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            let oldParams = this.gameParams;
            this.gameParams = params as GameParameters;
            
            if (oldParams == null || this.gameParams.sessionId != oldParams.sessionId) {
                if (this.gameParams.sessionId) {
                    this.webService.getSessionData(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                        this.sessionType = sessionData.type;
                        this.sessionName = sessionData.name;
                        this.totalEstimate = sessionData.estimate;
                        this.gameDataLoader = this.gameDataService.getDataLoader(this.sessionType);
                        this.setupRound(sessionData, true);
                    });
                }
                else {
                    throw new InterfaceError("Game settings page not loaded correctly.", params);
                }
            }
        });
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDisplayName(this.gameParams?.language);
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
        this.snackBar.open(message, undefined, {
            duration: 1000
        });
    }

    setupRound(sessionData: SessionData, refresh: boolean = false) {
        if (refresh) {
            this.sortableItemStrings = sessionData.items;
            this.deletedItemStrings = sessionData.deleted;
            this.historyStrings = sessionData.history;
            this.deletedHistoryStrings = sessionData.deletedHistory;
            this.choicesMade = sessionData.history.length;

            this.gameDataLoader?.getSortablesFromListOfStrings(Array.from(this.sortableItemStrings)).then((items: SortableObject[]) => {
                this.sortableItems = items;
                console.log(`Loaded sortable items: `, this.sortableItems);

                this.gameDataLoader?.getSortablesFromListOfStrings(this.deletedItemStrings).then((deletedItems: SortableObject[]) => {
                    this.deletedItems = deletedItems;
                    console.log(`Loaded deleted items: `, this.deletedItems);

                    this.historyStrings.forEach((history: string) => {
                        let split = history.split(',');
                        
                        let searchItemA = this.sortableItems.find((obj: SortableObject) => { return obj.getRepresentor() === split[0]; });
                        let searchItemB = this.sortableItems.find((obj: SortableObject) => { return obj.getRepresentor() === split[1]; });
                    
                        if (!searchItemA) throw new InterfaceError(`Could not find item A with id "${split[0]}".`);
                        if (!searchItemB) throw new InterfaceError(`Could not find item B with id "${split[1]}".`);

                        let searchChoice = split[2] == searchItemA.getRepresentor() ? searchItemA : searchItemB;
        
                        this.history.push({
                            itemA: searchItemA,
                            itemB: searchItemB,
                            choice: searchChoice
                        });
                    });
    
                    this.deletedHistoryStrings.forEach((deletedHistory: string) => {
                        let split = deletedHistory.split(',');
                        let searchItemA = this.deletedItems.find((obj: SortableObject) => { return obj.getRepresentor() == split[0]; });
                        let searchItemB = this.deletedItems.find((obj: SortableObject) => { return obj.getRepresentor() == split[1]; });

                        if (!searchItemA) searchItemA = this.sortableItems.find((obj: SortableObject) => { return obj.getRepresentor() == split[0]; });
                        if (!searchItemB) searchItemB = this.sortableItems.find((obj: SortableObject) => { return obj.getRepresentor() == split[1]; });

                        if (!searchItemA) throw new InterfaceError(`Could not find deleted item A with id "${split[0]}".`);
                        if (!searchItemB) throw new InterfaceError(`Could not find deleted item B with id "${split[1]}".`);
    
                        let searchChoice = split[2] == searchItemA.getRepresentor() ? searchItemA : searchItemB;

                        this.deletedHistory.push({
                            itemA: searchItemA,
                            itemB: searchItemB,
                            choice: searchChoice
                        });
                    });
                    
                    console.log(`Loaded history: `, this.history);
                    console.log(`Loaded deleted history: `, this.deletedHistory);

                    this.loadGameState(sessionData);
                });
            });
        }
        else {
            this.loadGameState(sessionData);
        }
    }

    loadGameState(sessionData: SessionData) {
        if (this.history.length > 0) {
            this.lastChoice = this.history[this.history.length - 1];
        }
        else {
            this.lastChoice = null;
        }

        if (!sessionData.options) {
            this.gameDataLoader?.getSortablesFromListOfStrings(Array.from(sessionData.results)).then((results: SortableObject[]) => {
                this.results = results;
                this.gameDone = true;
                this.currentTab = 2;
                console.log(`Loaded final results: `, this.results);
            });
        }
        else if (sessionData.options) {
            this.gameDone = false;
            let right = sessionData.options.itemA;
            let left = sessionData.options.itemB;
            this.currentTab = 1;

            this.sortableItems.forEach((item: SortableObject) => {
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
        if (this.leftItem) {
            this.sendAnswer(this.leftItem);
            this.lastChoice = { itemA: this.leftItem, itemB: this.rightItem, choice: this.leftItem }
            this.openSnackBar(`Selected ${this.leftItem.getDisplayName()}`);
        }
    }

    pickRight() {
        if (this.rightItem) {
            this.sendAnswer(this.rightItem);
            this.lastChoice = { itemA: this.leftItem, itemB: this.rightItem, choice: this.rightItem }
            this.openSnackBar(`Selected ${this.rightItem.getDisplayName()}`);
        }
    }

    deleteLeft() {
        if (this.leftItem) {
            this.sendDelete(this.leftItem);
            this.openSnackBar(`Deleted ${this.leftItem.getDisplayName()}`);
        }
    }

    deleteRight() {
        if (this.rightItem) {
            this.sendDelete(this.rightItem);
            this.openSnackBar(`Deleted ${this.rightItem.getDisplayName()}`);
        }
    }

    sendAnswer(choice: SortableObject) {
        if (this.gameParams && this.leftItem && this.rightItem) {
            this.webService.sendAnswer(this.gameParams.sessionId, this.leftItem, this.rightItem, choice).subscribe((sessionData: SessionData) => {
                this.choicesMade++;
                this.setupRound(sessionData);
            });
        }
    }

    undoPick() {
        if (this.gameParams) {
            if (this.lastChoice) {
                this.webService.undoAnswer(this.gameParams.sessionId, this.lastChoice.itemA, this.lastChoice.itemB, this.lastChoice.choice).subscribe((sessionData: SessionData) => {
                    this.choicesMade--;
                    this.currentTab = 1;
                    this.setupRound(sessionData);
                });
            }
            else {
                this.openSnackBar(`Nothing to undo.`);
            }
        }
    }

    undoDelete(item: SortableObject) {
        this.sendUndelete(item);
    }

    restartSession() {
        if (this.gameParams) {
            this.webService.restartSession(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
                this.currentTab = 1;
            });
        }
    }

    sendDelete(toDelete: SortableObject) {
        if (this.gameParams) {
            this.webService.deleteItem(this.gameParams.sessionId, toDelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
            });
        }
    }

    sendUndelete(toUndelete: SortableObject) {
        if (this.gameParams) {
            this.webService.undeleteItem(this.gameParams.sessionId, toUndelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
            });
        }
    }

    getSession(): string {
        return this.gameParams ? this.gameParams.sessionId : "";
    }

    estimateRemaining(): string {
        let upper = this.totalEstimate - this.choicesMade;
        let lower = Math.round(upper * 0.8);
        return upper !== lower ? `${lower}-${upper}` : `${upper}`;
    }

    export() {
        let output = "";
        this.results.forEach((item: SortableObject) => {
            output += `${item.getDisplayName()}\n`;
        });
        const link = document.createElement("a");
        const file = new Blob([output], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = `${this.sessionName}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}
