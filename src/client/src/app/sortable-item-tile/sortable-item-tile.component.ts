import { Component, Input } from '@angular/core';
import { SortableObject } from '../_objects/sortables/sortable';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-sortable-item-tile',
    standalone: true,
    imports: [MatCardModule, MatButtonModule],
    templateUrl: './sortable-item-tile.component.html',
    styleUrl: './sortable-item-tile.component.scss'
})
export class SortableItemTileComponent {
    @Input() item: SortableObject = new SortableObject();
}
