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
import { LoggerService } from '../_services/logger-service';

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

    choicesFlipped: boolean = false;
    leftItem: SortableObject | null = null;
    rightItem: SortableObject | null = null;

    language: string = "en";
    sessionType: string = '';
    sessionName: string = '';

    currentTab: number = 1;
    requestActive: boolean = false;
    gameDone: boolean = false;

    constructor(
        private logger: LoggerService,
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
                    this.requestActive = true;
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
                            this.logger.debug(`Loaded sortable items: `, this.sortableItems);

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
            this.logger.debug(`Loaded deleted items: `, this.deletedItems);

            this.history = this.parseComparisons(this.historyStrings);
            this.logger.debug(`Loaded history: `, this.history);

            this.deletedHistory = this.parseComparisons(this.deletedHistoryStrings);
            this.logger.debug(`Loaded deleted history: `, this.deletedHistory);
        }

        this.loadGameState(sessionData);
        this.requestActive = false;
    }

    loadGameState(sessionData: SessionData) {
        if (this.history.length > 0) {
            this.lastChoice = this.history[this.history.length - 1];
        }
        else {
            this.lastChoice = null;
        }

        if (!sessionData.options) {
            this.leftItem = null;
            this.rightItem = null;
            this.gameDataLoader?.getSortablesFromListOfStrings(Array.from(sessionData.results)).then((results: SortableObject[]) => {
                this.results = results;
                this.gameDone = true;
                this.currentTab = 2;
                this.logger.debug(`Loaded final results: `, this.results);
            });
        }
        else if (sessionData.options) {
            this.gameDone = false;
            this.currentTab = 1;

            let itemA = this.sortableItems.get(sessionData.options.itemA);
            let itemB = this.sortableItems.get(sessionData.options.itemB);
            if (!itemA) {
                throw new InterfaceError(`Could not load left item: "${sessionData.options.itemA}".`);
            }
            if (!itemB) {
                throw new InterfaceError(`Could not load right item: "${sessionData.options.itemB}".`);
            }
            
            let random = Math.floor(Math.random() * 2);
            this.choicesFlipped = random === 1;
            this.leftItem = random === 0 ? itemA : itemB;
            this.rightItem = random === 0 ? itemB : itemA;
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
        if (this.leftItem && this.rightItem) {
            this.lastChoice = { itemA: this.leftItem, itemB: this.rightItem, choice: this.leftItem }
            this.sendAnswer(this.choicesFlipped ? this.rightItem : this.leftItem);
            this.openSnackBar(`Selected ${this.leftItem.getDisplayName(this.language)}`);
        }
        else {
            this.openSnackBar(`Nothing to pick.`);
        }
    }

    pickRight() {
        if (this.leftItem && this.rightItem) {
            this.lastChoice = { itemA: this.leftItem, itemB: this.rightItem, choice: this.rightItem }
            this.sendAnswer(this.choicesFlipped ? this.leftItem : this.rightItem);
            this.openSnackBar(`Selected ${this.rightItem.getDisplayName(this.language)}`);
        }
        else {
            this.openSnackBar(`Nothing to pick.`);
        }
    }

    deleteLeft() {
        if (this.leftItem && this.rightItem) {
            this.sendDelete(this.leftItem);
            this.openSnackBar(`Deleted ${this.leftItem.getDisplayName(this.language)}`);
        }
        else {
            this.openSnackBar(`Nothing to delete.`);
        }
    }

    deleteRight() {
        if (this.leftItem && this.rightItem) {
            this.sendDelete(this.rightItem);
            this.openSnackBar(`Deleted ${this.rightItem.getDisplayName(this.language)}`);
        }
        else {
            this.openSnackBar(`Nothing to delete.`);
        }
    }

    sendAnswer(choice: SortableObject) {
        if (!this.requestActive && this.gameParams && this.leftItem && this.rightItem && this.lastChoice) {
            this.history.push(this.lastChoice);
            this.requestActive = true;
            this.sessionService.sendAnswer(this.gameParams.sessionId, this.leftItem, this.rightItem, choice, false).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, false);
            });
        }
    }

    undoPick(choice?: Comparison) {
        if (!this.requestActive && this.gameParams) {
            if (this.lastChoice) {
                this.history.pop();
                this.requestActive = true;
                this.sessionService.undoAnswer(this.gameParams.sessionId, this.lastChoice.itemA, this.lastChoice.itemB, this.lastChoice.choice, false).subscribe((sessionData: SessionData) => {
                    this.currentTab = 1;
                    this.setupRound(sessionData, false);
                });
            }
            else if (choice) {
                this.requestActive = true;
                this.sessionService.undoAnswer(this.gameParams.sessionId, choice.itemA, choice.itemB, choice.choice, true).subscribe((sessionData: SessionData) => {
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
        if (!this.requestActive && this.gameParams) {
            this.requestActive = true;
            this.sessionService.restartSession(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
                this.currentTab = 1;
            });
        }
    }

    sendDelete(toDelete: SortableObject) {
        if (!this.requestActive && this.gameParams) {
            this.requestActive = true;
            this.sessionService.deleteItem(this.gameParams.sessionId, toDelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
            });
        }
    }

    sendUndelete(toUndelete: SortableObject) {
        if (!this.requestActive && this.gameParams) {
            this.requestActive = true;
            this.sessionService.undeleteItem(this.gameParams.sessionId, toUndelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
            });
        }
    }

    getSession(): string {
        return this.gameParams ? this.gameParams.sessionId : "";
    }

    estimateRemaining(): string {
        if (this.gameDone) {
            return "0";
        }
        let upper = this.totalEstimate - this.choicesMade;
        let lower = Math.round(upper * 0.8);
        if (upper > 10) {
            upper = Math.ceil(upper / 10) * 10; 
        }
        if (lower > 10) {
            lower = Math.ceil(lower / 10) * 10; 
        }
        return upper !== lower ? `~${lower}-${upper}` : `~${upper}`;
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
