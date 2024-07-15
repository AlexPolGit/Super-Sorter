import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortableObject } from '../_objects/sortables/sortable';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { UserPreferenceService } from '../_services/user-preferences-service';

@Component({
    selector: 'app-sortable-item-tile',
    standalone: true,
    imports: [ CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule ],
    templateUrl: './sortable-item-tile.component.html',
    styleUrl: './sortable-item-tile.component.scss'
})
export class SortableItemTileComponent {
    @Input() item: SortableObject | null = null;
    @Output() selected = new EventEmitter();
    @Output() deleted = new EventEmitter();

    constructor(private userPreferenceService: UserPreferenceService) {}

    ngAfterViewChecked() {
        let previewAudioPlayer = document.getElementsByClassName('preview-audio-player-' + this.item?.id);
        if (previewAudioPlayer.length > 0) {
            let audioPreference = this.userPreferenceService.getAudioPreviewVolume();
            (previewAudioPlayer.item(0) as HTMLAudioElement).volume = (audioPreference / 100);
        }
    }

    selectThis() {
        this.selected.emit();
    }

    deleteThis() {
        this.deleted.emit();
    }

    openLink() {
        let link = this.item?.getLink();
        if (link) {
            window.open(link, "_blank");
        }
    }

    getItemDisplayName(item: SortableObject | null) {
        return item ? item.getDisplayName(this.userPreferenceService.getAnilistLanguage()) : "";
    }
}
