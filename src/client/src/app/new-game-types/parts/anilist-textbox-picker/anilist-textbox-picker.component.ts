import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';

@Component({
    selector: 'app-anilist-textbox-picker',
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './anilist-textbox-picker.component.html',
    styleUrl: './anilist-textbox-picker.component.scss'
})
export class AnilistTextboxPickerComponent {

    @Input() loader: string = "default";
    @Input() textboxPlaceholder: string = "Enter items IDs seperated by newlines.";
    @Input() textboxLabel: string = "Item IDs";
    @Input() buttonName: string = "Load Items";
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    dataLoader: AnilistLoader | null = null;
    characterTextbox: string = "";

    constructor(private gameDataService: GameDataService) {}

    ngOnInit() {
        this.dataLoader = this.gameDataService.getDataLoader(this.loader) as AnilistLoader;
    }

    async loadFromTextbox() {
        if (this.dataLoader) {
            let lines = this.characterTextbox.split(/\r?\n/).map((id: string) => parseInt(id));
            this.dataLoader.getItemListFromIds(lines, [], 1).then((characters: SortableObject[]) => {
                this.chooseData.emit(characters);
            });
        }
    }
}
