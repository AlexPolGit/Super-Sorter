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
import { CONFIRM_MODAL_HEIGHT, CONFIRM_MODAL_WIDTH, ConfirmDialogInput, ConfirmDialogOutput, ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

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

    allItems: Map<string, SortableObject> = new Map<string, SortableObject>();

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
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private titleService: Title
    ) {
        this.titleService.setTitle($localize`:@@page-title-game-page-loading:Super Sorter\: Loading Session...`);
    }

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

                        this.titleService.setTitle($localize`:@@game-menu-page-title:Super Sorter: ${this.sessionName}:session-name:`);

                        this.gameDataLoader.getSortablesFromListOfStrings(sessionData.items.concat(sessionData.deleted)).then((items: SortableObject[]) => {
                            this.allItems = new Map<string, SortableObject>();
                            items.forEach((item: SortableObject) => {
                                this.allItems.set(item.getRepresentor(), item);
                            });
                            this.logger.debug(`Loaded all items: {0}`, this.allItems);

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
        if (this.leftItem && this.rightItem) {
            if (event.key == "ArrowLeft") {
                this.sendAnswer(this.leftItem);
            }
            else if (event.key == "ArrowRight") {
                this.sendAnswer(this.rightItem);
            }
            else if (event.key == "ArrowUp") {
                this.undoPick();
            }
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

            this.deletedItemStrings.forEach((deletedItem: string) => {
                if (this.allItems.has(deletedItem)) {
                    this.deletedItems.push(this.allItems.get(deletedItem) as SortableObject);
                }
            });
            this.logger.debug(`Loaded deleted items: {0}`, this.deletedItems);

            this.history = this.parseComparisons(this.historyStrings);
            this.logger.debug(`Loaded history: {0}`, this.history);

            this.deletedHistory = this.parseComparisons(this.deletedHistoryStrings);
            this.logger.debug(`Loaded deleted history: {0}`, this.deletedHistory);
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
                this.logger.debug(`Loaded final results: {0}`, this.results);
            });
        }
        else if (sessionData.options) {
            this.gameDone = false;
            this.currentTab = 1;

            let itemA = this.allItems.get(sessionData.options.itemA);
            let itemB = this.allItems.get(sessionData.options.itemB);
            if (!itemA) {
                throw new InterfaceError(`Could not load left item: "${sessionData.options.itemA}".`);
            }
            if (!itemB) {
                throw new InterfaceError(`Could not load right item: "${sessionData.options.itemB}".`);
            }

            this.leftItem = itemA;
            this.rightItem = itemB;
        }
    }

    parseComparisons(stringList: string[]): Comparison[] {
        return stringList.map<Comparison>((history: string) => {
            let split = history.split(',');

            let searchItemA = this.allItems.get(split[0]);
            let searchItemB = this.allItems.get(split[1]);
            
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

    sendAnswer(choice: SortableObject) {
        if (!this.requestActive && this.gameParams && this.leftItem && this.rightItem) {
            this.logger.debug(`Picking: [${choice.getRepresentor()}] ${choice.getDisplayName(this.language)}`);

            this.lastChoice = { itemA: this.leftItem, itemB: this.rightItem, choice: choice };
            this.history.push(this.lastChoice);

            this.requestActive = true;
            this.sessionService.sendAnswer(this.gameParams.sessionId, this.leftItem, this.rightItem, choice, false).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, false);
                this.openSnackBar(`Selected ${choice.getDisplayName(this.language)}`);
            });
        }
    }

    undoPick(choice?: Comparison) {
        if (!this.requestActive && this.gameParams) {
            if (choice) {
                this.logger.debug(`Undoing selected choice: ${choice.itemA.getRepresentor()} vs ${choice.itemB.getRepresentor()} = ${choice.choice.getRepresentor()}`);

                this.requestActive = true;
                this.sessionService.undoAnswer(this.gameParams.sessionId, choice.itemA, choice.itemB, choice.choice, true).subscribe((sessionData: SessionData) => {
                    this.currentTab = 1;
                    this.setupRound(sessionData, true);
                });
            }
            else if (this.lastChoice) {
                this.logger.debug(`Undoing last choice: ${this.lastChoice.itemA.getRepresentor()} vs ${this.lastChoice.itemB.getRepresentor()} = ${this.lastChoice.choice.getRepresentor()}`);

                this.history.pop();
                this.requestActive = true;
                this.sessionService.undoAnswer(this.gameParams.sessionId, this.lastChoice.itemA, this.lastChoice.itemB, this.lastChoice.choice, false).subscribe((sessionData: SessionData) => {
                    this.currentTab = 1;
                    this.setupRound(sessionData, false);
                });
            }
            else {
                this.openSnackBar(`Nothing to undo.`);
            }
        }
    }

    sendDelete(toDelete: SortableObject) {
        if (!this.requestActive && this.gameParams && this.leftItem && this.rightItem) {
            this.logger.debug(`Deleting: [${toDelete.getRepresentor()}] ${toDelete.getDisplayName(this.language)}`);

            this.requestActive = true;
            this.sessionService.deleteItem(this.gameParams.sessionId, toDelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
                this.openSnackBar(`Deleted ${toDelete.getDisplayName(this.language)}`);
            });
        }
        else {
            this.openSnackBar(`Nothing to delete.`);
        }
    }

    sendUndelete(toUndelete: SortableObject) {
        if (!this.requestActive && this.gameParams) {
            this.logger.debug(`Undeleting: [${toUndelete.getRepresentor()}] ${toUndelete.getDisplayName(this.language)}`);

            this.requestActive = true;
            this.sessionService.undeleteItem(this.gameParams.sessionId, toUndelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
            });
        }
    }

    restartSession() {
        if (!this.requestActive) {
            let input: ConfirmDialogInput = {
                confirmationTitle: $localize`:@@game-menu-restart-session-confirm-title:Confirm Restart`,
                confirmationText: $localize`:@@game-menu-restart-session-confirm-message:Are you sure you want to restart this session?`
            };
            
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                data: input,
                height: CONFIRM_MODAL_HEIGHT,
                width: CONFIRM_MODAL_WIDTH
            });
    
            dialogRef.afterClosed().subscribe((result: ConfirmDialogOutput | undefined) => {
                this.logger.debug(`Confirmation data from dialog: {0}`, result);
                if (this.gameParams && result && result.choice == "confirm") {
                    this.requestActive = true;
                    this.sessionService.restartSession(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                        this.setupRound(sessionData, true);
                        this.currentTab = 1;
                    });
                }
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
