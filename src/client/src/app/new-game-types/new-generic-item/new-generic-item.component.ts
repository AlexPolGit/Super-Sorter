import { Component } from '@angular/core';
import { GenericItemLoader } from 'src/app/_util/game-loaders/generic-item-loader';
import { NewGameTypeComponent } from '../new-game-type.component';

@Component({
    selector: 'app-new-generic-item',
    templateUrl: './new-generic-item.component.html',
    styleUrl: './new-generic-item.component.scss'
})
export class NewGenericItemComponent extends NewGameTypeComponent<GenericItemLoader> {}
