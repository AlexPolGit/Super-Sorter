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
import { CONFIRM_MODAL_HEIGHT, CONFIRM_MODAL_WIDTH, ConfirmDialogInput, ConfirmDialogOutput, ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { UserPreferenceService } from '../_services/user-preferences-service';
import { SessionExportObject } from '../_objects/export-gamestate';

export interface GameParameters extends BaseParameters {
    sessionId: string;
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

    algorithm: string = "";
    seed: number = 0;
    allItems: Map<string, SortableObject> = new Map<string, SortableObject>();

    deletedItems: SortableObject[] = [];
    deletedItemStrings: string[] = [];

    history: Comparison[] = [];
    historyStrings: string[] = [];
    filteredHistory: Comparison[] = [];

    deletedHistory: Comparison[] = [];
    deletedHistoryStrings: string[] = [];

    lastChoice: Comparison | null = null;
    results: SortableObject[] = [];

    totalEstimate: number = 0;
    choicesMade: number = 0;
    progress: number = 0;

    leftItem: SortableObject | null = null;
    rightItem: SortableObject | null = null;

    sessionType: string = '';
    sessionName: string = '';

    currentTab: number = 1;
    requestActive: boolean = false;
    gameDone: boolean = false;
    previousLeftItem: SortableObject | null = null;
    previousRightItem: SortableObject | null = null;

    historySearch: string = "";

    constructor(
        private route: ActivatedRoute,
        private sessionService: SessionService,
        private gameDataService: GameDataService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private titleService: Title,
        private userPreferenceService: UserPreferenceService
    ) {
        this.titleService.setTitle($localize`:@@page-title-game-page-loading:Super Sorter\: Loading Session...`);
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            let oldParams = this.gameParams;
            this.gameParams = params as GameParameters;
            
            if (oldParams == null || this.gameParams.sessionId != oldParams.sessionId) {
                if (this.gameParams.sessionId) {
                    this.requestActive = true;
                    this.sessionService.getSessionData(this.gameParams.sessionId).subscribe((sessionData: SessionData) => {
                        this.sessionType = sessionData.type;
                        this.sessionName = sessionData.name;
                        this.totalEstimate = sessionData.estimate;
                        this.algorithm = sessionData.algorithm;
                        this.seed = sessionData.seed;
                        this.gameDataLoader = this.gameDataService.getDataLoader(this.sessionType);

                        this.titleService.setTitle($localize`:@@game-menu-page-title:Super Sorter: ${this.sessionName}:session-name:`);

                        this.gameDataLoader.getSortablesFromListOfStrings(sessionData.items.concat(sessionData.deleted)).then((items: SortableObject[]) => {
                            this.allItems = new Map<string, SortableObject>();
                            items.forEach((item: SortableObject) => {
                                this.allItems.set(item.getRepresentor(), item);
                            });
                            console.log(`Loaded all items:`, this.allItems);

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
        return item.getDisplayName(this.userPreferenceService.getAnilistLanguage());
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (this.currentTab === 1 && this.leftItem && this.rightItem) {
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
            console.log(`Loaded deleted items:`, this.deletedItems);

            this.history = this.parseComparisons(this.historyStrings);
            console.log(`Loaded history:`, this.history);

            this.deletedHistory = this.parseComparisons(this.deletedHistoryStrings);
            console.log(`Loaded deleted history:`, this.deletedHistory);
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

        this.filterComparisonList();

        if (!sessionData.options) {
            this.leftItem = null;
            this.rightItem = null;
            this.progress = 100;
            this.gameDataLoader?.getSortablesFromListOfStrings(Array.from(sessionData.results)).then((results: SortableObject[]) => {
                this.results = results;
                this.gameDone = true;
                this.currentTab = 2;
                console.log(`Loaded final results:`, this.results);
            });
        }
        else if (sessionData.options) {
            this.gameDone = false;
            this.currentTab = 1;

            if (sessionData.progress / this.totalEstimate >= 0.99) {
                this.progress = 99;
            }
            else {
                this.progress = (sessionData.progress / this.totalEstimate) * 100;
            }

            let itemA = this.allItems.get(sessionData.options.itemA);
            let itemB = this.allItems.get(sessionData.options.itemB);
            if (!itemA) {
                throw new InterfaceError(`Could not load left item: "${sessionData.options.itemA}".`);
            }
            if (!itemB) {
                throw new InterfaceError(`Could not load right item: "${sessionData.options.itemB}".`);
            }

            this.previousLeftItem = this.leftItem;
            this.previousRightItem = this.rightItem;
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
            console.log(`Picking: [${choice.getRepresentor()}] ${this.getItemDisplayName(choice)}`);

            this.lastChoice = { itemA: this.leftItem, itemB: this.rightItem, choice: choice };
            this.history.push(this.lastChoice);

            this.requestActive = true;
            this.sessionService.sendAnswer(this.gameParams.sessionId, this.leftItem, this.rightItem, choice, false).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, false);
                this.openSnackBar($localize`:@@game-menu-selected-item:Selected ${this.getItemDisplayName(choice)}:item:`);
            });
        }
    }

    undoPick(choice?: Comparison) {
        if (!this.requestActive && this.gameParams) {
            if (choice) {
                console.log(`Undoing selected choice: ${choice.itemA.getRepresentor()} vs ${choice.itemB.getRepresentor()} = ${choice.choice.getRepresentor()}`);
                this.openSnackBar($localize`:@@game-menu-undid-item:Undid ${this.getItemDisplayName(choice.itemA)}:itemA: vs ${this.getItemDisplayName(choice.itemB)}:itemB: = ${this.getItemDisplayName(choice.choice)}:winner:`);

                this.requestActive = true;
                this.sessionService.undoAnswer(this.gameParams.sessionId, choice.itemA, choice.itemB, choice.choice, true).subscribe((sessionData: SessionData) => {
                    this.currentTab = 1;
                    this.setupRound(sessionData, true);
                });
            }
            else if (this.lastChoice) {
                console.log(`Undoing last choice: ${this.lastChoice.itemA.getRepresentor()} vs ${this.lastChoice.itemB.getRepresentor()} = ${this.lastChoice.choice.getRepresentor()}`);
                this.openSnackBar($localize`:@@game-menu-undid-item:Undid ${this.getItemDisplayName(this.lastChoice.itemA)}:itemA: vs ${this.getItemDisplayName(this.lastChoice.itemB)}:itemB: = ${this.getItemDisplayName(this.lastChoice.choice)}:winner:`);

                this.history.pop();
                this.requestActive = true;
                this.sessionService.undoAnswer(this.gameParams.sessionId, this.lastChoice.itemA, this.lastChoice.itemB, this.lastChoice.choice, false).subscribe((sessionData: SessionData) => {
                    this.currentTab = 1;
                    this.setupRound(sessionData, false);
                });
            }
            else {
                this.openSnackBar($localize`:@@game-menu-nothing-to-undo:Nothing to undo.`);
            }
        }
    }

    sendDelete(toDelete: SortableObject) {
        if (!this.requestActive && this.gameParams && this.leftItem && this.rightItem) {
            console.log(`Deleting: [${toDelete.getRepresentor()}] ${this.getItemDisplayName(toDelete)}`);

            this.requestActive = true;
            this.sessionService.deleteItem(this.gameParams.sessionId, toDelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
                this.openSnackBar($localize`:@@game-menu-deleted-item:Deleted ${this.getItemDisplayName(toDelete)}:item:`);
            });
        }
        else {
            this.openSnackBar($localize`:@@game-menu-nothing-to-delete:Nothing to delete.`);
        }
    }

    sendUndelete(toUndelete: SortableObject) {
        if (!this.requestActive && this.gameParams) {
            console.log(`Undeleting: [${toUndelete.getRepresentor()}] ${this.getItemDisplayName(toUndelete)}`);

            this.requestActive = true;
            this.sessionService.undeleteItem(this.gameParams.sessionId, toUndelete).subscribe((sessionData: SessionData) => {
                this.setupRound(sessionData, true);
                this.openSnackBar($localize`:@@game-menu-undeleted-item:Undeleted ${this.getItemDisplayName(toUndelete)}:item:`);
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
                console.log(`Confirmation data from dialog:`, result);
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

    export(type: 'txt' | 'csv' | 'clipboard') {
        const link = document.createElement("a");
        let file = new Blob([]);

        let output = "";
        if (type === 'txt') {
            this.results.forEach((item: SortableObject, index: number) => {
                output += `${index + 1}. ${this.getItemDisplayName(item)}\n`;
            });

            file = new Blob([output], { type: 'text/plain;charset=utf8' });
            link.download = `${this.sessionName}.txt`;
        }
        else if (type === 'csv') {
            output += "rank,name,link\n"
            this.results.forEach((item: SortableObject, index: number) => {
                output += `${index + 1},${this.getItemDisplayName(item)},${item.getLink()}\n`;
            });

            file = new Blob([output], { type: 'text/csv;charset=utf8' });
            link.download = `${this.sessionName}.csv`;
        }
        else if (type === 'clipboard') {
            this.results.forEach((item: SortableObject, index: number) => {
                output += `${index + 1}. ${this.getItemDisplayName(item)}\n`;
            });

            navigator.clipboard.writeText(output);
            this.openSnackBar($localize`:@@game-menu-copied-to-clipboard:Results copied to clipboard.`);
            return;
        }
        
        link.href = URL.createObjectURL(file);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    shareSession() {
        const link = document.createElement("a");
        let file = new Blob([]);

        let exportObject: SessionExportObject = {
            type: this.sessionType,
            items: Array.from(this.allItems.keys())
        };

        file = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json;charset=utf8' });
        link.download = `${this.sessionName}-data.json`;
        
        link.href = URL.createObjectURL(file);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    filterComparisonList() {
        this.filteredHistory = this.history.filter((comparison: Comparison) => {
            if (comparison.itemA.nameContainsSubstring(this.historySearch)) {
                return true;
            }
            else if (comparison.itemB.nameContainsSubstring(this.historySearch)) {
                return true;
            }
            else if (comparison.choice.nameContainsSubstring(this.historySearch)) {
                return true;
            }
            else {
                return false;
            }
        });
    }
}
