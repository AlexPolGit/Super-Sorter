import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../_services/session-service';
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

    sortableItems: Map<string, SortableObject> = new Map<string, SortableObject>();
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

    language: string = "en";
    sessionType: string = '';
    sessionName: string = '';

    currentTab: number = 1;
    gameDone: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private sessionService: SessionService,
        private gameDataService: GameDataService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            let oldParams = this.gameParams;
            this.gameParams = params as GameParameters;
            this.language = params.language ? params.language : "en";
            
            if (oldParams == null || this.gameParams.sessionId != oldParams.sessionId) {
                if (this.gameParams.sessionId) {
                    this.sessionService.getSessionData(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                        this.sessionType = sessionData.type;
                        this.sessionName = sessionData.name;
                        this.totalEstimate = sessionData.estimate;
                        this.gameDataLoader = this.gameDataService.getDataLoader(this.sessionType);

                        this.gameDataLoader.getSortablesFromListOfStrings(sessionData.items).then((items: SortableObject[]) => {
                            this.sortableItems = new Map<string, SortableObject>();
                            items.forEach((item: SortableObject) => {
                                this.sortableItems.set(item.getRepresentor(), item);
                            });
                            console.log(`Loaded sortable items: `, this.sortableItems);

                            this.setupRound(sessionData, true);
                        });
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
            this.deletedItemStrings = sessionData.deleted;
            this.historyStrings = sessionData.history;
            this.deletedHistoryStrings = sessionData.deletedHistory;
            this.choicesMade = sessionData.history.length;

            this.history = [];
            this.deletedItems = [];

            this.deletedItems = this.deletedItemStrings.map<SortableObject>((deletedItem: string) => {
                let mapValue = this.sortableItems.get(deletedItem);
                if (mapValue) {
                    return mapValue;
                }
                else {
                    throw new InterfaceError(`Could not find deleted item with id "${deletedItem}".`);
                }
            });
            console.log(`Loaded deleted items: `, this.deletedItems);

            this.history = this.parseComparisons(this.historyStrings);
            console.log(`Loaded history: `, this.history);

            this.deletedHistory = this.parseComparisons(this.deletedHistoryStrings);
            console.log(`Loaded deleted history: `, this.deletedHistory);
        }
        this.loadGameState(sessionData);
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
            this.currentTab = 1;

            let left = this.sortableItems.get(sessionData.options.itemB);
            if (!left) {
                throw new InterfaceError(`Could not load left item: "${sessionData.options.itemB}".`);
            }
            this.leftItem = left;

            let right = this.sortableItems.get(sessionData.options.itemA);
            if (!right) {
                throw new InterfaceError(`Could not load right item: "${sessionData.options.itemA}".`);
            }
            this.rightItem = right;
        }
    }

    parseComparisons(stringList: string[]): Comparison[] {
        return stringList.map<Comparison>((history: string) => {
            let split = history.split(',');

            let searchItemA = this.sortableItems.get(split[0]);
            let searchItemB = this.sortableItems.get(split[1]);
            
            if (!searchItemA) {
                throw new InterfaceError(`Could not find item A with id "${split[0]}".`, undefined, stringList);
            }
            else if (!searchItemB) {
                throw new InterfaceError(`Could not find item B with id "${split[1]}".`, undefined, stringList);
            }

            let choice = split[2] == searchItemA.getRepresentor() ? searchItemA : searchItemB;

            return {
                itemA: searchItemA,
                itemB: searchItemB,
                choice: choice
            };
        });
    }

    pickLeft() {
        if (this.leftItem) {
            this.sendAnswer(this.leftItem);
            this.lastChoice = { itemA: this.leftItem, itemB: this.rightItem, choice: this.leftItem }
            this.openSnackBar(`Selected ${this.leftItem.getDisplayName(this.language)}`);
        }
    }

    pickRight() {
        if (this.rightItem) {
            this.sendAnswer(this.rightItem);
            this.lastChoice = { itemA: this.leftItem, itemB: this.rightItem, choice: this.rightItem }
            this.openSnackBar(`Selected ${this.rightItem.getDisplayName(this.language)}`);
        }
    }

    deleteLeft() {
        if (this.leftItem) {
            this.sendDelete(this.leftItem);
            this.openSnackBar(`Deleted ${this.leftItem.getDisplayName(this.language)}`);
        }
    }

    deleteRight() {
        if (this.rightItem) {
            this.sendDelete(this.rightItem);
            this.openSnackBar(`Deleted ${this.rightItem.getDisplayName(this.language)}`);
        }
    }

    sendAnswer(choice: SortableObject) {
        if (this.gameParams && this.leftItem && this.rightItem) {
            this.sessionService.sendAnswer(this.gameParams.sessionId, this.leftItem, this.rightItem, choice).subscribe((sessionData: SessionData) => {
                this.choicesMade++;
                this.setupRound(sessionData, true);
            });
        }
    }

    undoPick(choice?: Comparison) {
        if (this.gameParams) {
            if (this.lastChoice) {
                this.sessionService.undoAnswer(this.gameParams.sessionId, this.lastChoice.itemA, this.lastChoice.itemB, this.lastChoice.choice).subscribe((sessionData: SessionData) => {
                    this.choicesMade--;
                    this.currentTab = 1;
                    this.setupRound(sessionData, true);
                });
            }
            else if (choice) {
                this.sessionService.undoAnswer(this.gameParams.sessionId, choice.itemA, choice.itemB, choice.choice).subscribe((sessionData: SessionData) => {
                    this.choicesMade--;
                    this.currentTab = 1;
                    this.setupRound(sessionData, true);
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
            this.sessionService.restartSession(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
                this.currentTab = 1;
            });
        }
    }

    sendDelete(toDelete: SortableObject) {
        if (this.gameParams) {
            this.sessionService.deleteItem(this.gameParams.sessionId, toDelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
            });
        }
    }

    sendUndelete(toUndelete: SortableObject) {
        if (this.gameParams) {
            this.sessionService.undeleteItem(this.gameParams.sessionId, toUndelete).subscribe((sessionData: SessionData) => {
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
        if (upper > 10) {
            upper = Math.ceil(upper / 10) * 10; 
        }
        if (lower > 10) {
            lower = Math.ceil(lower / 10) * 10; 
        }
        return upper !== lower ? `${lower}-${upper}` : `${upper}`;
    }

    export(type: 'txt' | 'csv') {
        const link = document.createElement("a");
        let file = new Blob([]);

        let output = "";
        if (type === 'txt') {
            this.results.forEach((item: SortableObject, index: number) => {
                output += `${index + 1}. ${item.getDisplayName(this.language)}\n`;
            });

            file = new Blob([output], { type: 'text/plain;charset=utf8' });
            link.download = `${this.sessionName}.txt`;
        }
        else if (type === 'csv') {
            output += "rank,name,link\n"
            this.results.forEach((item: SortableObject, index: number) => {
                output += `${index + 1},${item.getDisplayName(this.language)},${item.getLink()}\n`;
            });

            file = new Blob([output], { type: 'text/csv;charset=utf8' });
            link.download = `${this.sessionName}.csv`;
        }
        
        link.href = URL.createObjectURL(file);
        link.click();
        URL.revokeObjectURL(link.href);
    }
}
