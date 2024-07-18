import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SortableObject } from '../_objects/sortables/sortable';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { UserPreferenceService } from '../_services/user-preferences-service';
import { AnimationBuilder, AnimationMetadata, AnimationPlayer, animate, style } from '@angular/animations';

@Component({
    selector: 'app-sortable-item-tile',
    standalone: true,
    imports: [ CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule ],
    templateUrl: './sortable-item-tile.component.html',
    styleUrl: './sortable-item-tile.component.scss'
})
export class SortableItemTileComponent {
    @Input() item: SortableObject = new SortableObject({ id: "", data: { imageUrl: "" } });
    @Input() previousItem: SortableObject | null = null;
    @Input() side: "left" | "right" = "left";
    @Output() selected = new EventEmitter();
    @Output() deleted = new EventEmitter();
    @ViewChild('itemTile', { read: ElementRef, static: false }) itemTile: ElementRef | undefined;
    @ViewChild('tooltipTarget', { static: true, read: MatTooltip }) tooltip: MatTooltip | undefined;

    previousItemId: string | null = null;
    currentImageUrl: string = "";

    showAnimation: boolean = true;
    fadeInAnimation: AnimationPlayer | null = null;
    fadeAwayAnimation: AnimationPlayer | null = null;
    inTransition: boolean = false;

    private fadeInAnimationData(): AnimationMetadata[] {
        return [
            style({
                "top": "25%",
                "visibility": "hidden",
                "opacity": 0
            }),
            animate('200ms ease-in', style({
                "top": "0",
                "visibility": "visible",
                "opacity": 1
            }))
        ];
    }

    private fadeAwayAnimationData(): AnimationMetadata[] {
        if (this.side === "left") {
            return [
                style({
                    "right": "0",
                    "visibility": "visible",
                    "opacity": 1
                }),
                animate('200ms ease-in', style({
                    "right": "25%",
                    "visibility": "hidden",
                    "opacity": 0
                }))
            ];
        }
        else {
            return [
                style({
                    "left": "0",
                    "visibility": "visible",
                    "opacity": 1
                }),
                animate('200ms ease-in', style({
                    "left": "25%",
                    "visibility": "hidden",
                    "opacity": 0
                }))
            ];
        }
    }

    constructor(
        private userPreferenceService: UserPreferenceService,
        private builder: AnimationBuilder,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.changeDetectorRef.detectChanges();
        this.setupAnimations();
        this.playAnimations();
    }

    ngAfterViewChecked() {
        let previewAudioPlayer = document.getElementsByClassName('preview-audio-player-' + this.item?.id);
        if (previewAudioPlayer.length > 0) {
            let audioPreference = this.userPreferenceService.getAudioPreviewVolume();
            (previewAudioPlayer.item(0) as HTMLAudioElement).volume = (audioPreference / 100);
        }
    }

    ngOnChanges(changes: any) {
        this.showAnimation = (this.userPreferenceService.getPerformanceMode() === false);
        this.playAnimations();
    }

    setupAnimations() {
        const fadeInAnimationFactory = this.builder.build(this.fadeInAnimationData());
        const fadeAwayAnimationFactory = this.builder.build(this.fadeAwayAnimationData());

        if (this.itemTile) {
            this.fadeInAnimation = fadeInAnimationFactory.create(this.itemTile.nativeElement);
            this.fadeInAnimation.onStart(() => {
                this.inTransition = true;
            });
            this.fadeInAnimation.onDone(() => {
                this.fadeInAnimation?.reset();
                this.inTransition = false;
            });

            this.fadeAwayAnimation = fadeAwayAnimationFactory.create(this.itemTile.nativeElement);
            this.fadeAwayAnimation.onStart(() => {
                this.inTransition = true;
                this.currentImageUrl = (this.previousItem as SortableObject).imageUrl;
            });
            this.fadeAwayAnimation.onDone(() => {
                this.currentImageUrl = this.item.imageUrl;
                this.fadeAwayAnimation?.reset();
                this.fadeInAnimation?.play();
                this.inTransition = false;
            });
        }
    }

    playAnimations() {
        if (this.showAnimation) {
            // If currently playing animation, stop it early because we have another item to display.
            if (this.inTransition) {
                this.fadeInAnimation?.finish();
                this.fadeAwayAnimation?.finish();
            }

            // If there was no previous item, the page just loaded so we show the fade-in animation.
            if (this.previousItem === null) {
                this.currentImageUrl = this.item.imageUrl;
                this.fadeInAnimation?.play();
            }
            // If the previous item was not the same as the current item, fade out the old item and replace it with a fade-in of the new one.
            else if (this.previousItem.id !== this.item.id) {
                this.fadeAwayAnimation?.play();
            }
            // If the previous item was the same as the current item, do not play an animation.
        }
        this.currentImageUrl = this.item ? this.item.imageUrl : "";
    }

    selectThis() {
        if (!this.inTransition) {
            this.selected.emit();
        }
    }

    deleteThis() {
        if (!this.inTransition) {
            this.deleted.emit();
        }
    }

    openLink() {
        if (!this.inTransition) {
            let link = this.item?.getLink();
            if (link) {
                window.open(link, "_blank");
            }
        }
    }

    getItemDisplayName(): string {
        if (this.inTransition && this.previousItem) {
            return this.previousItem.getDisplayName(this.userPreferenceService.getAnilistLanguage());
        }
        else {
            return this.item ? this.item.getDisplayName(this.userPreferenceService.getAnilistLanguage()) : "";
        }
    }

    showTooltip(event: MouseEvent) {
        this.tooltip?.show();
    }

    hideTooltip() {
        this.tooltip?.hide();
    }
}
