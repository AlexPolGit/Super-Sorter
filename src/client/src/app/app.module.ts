import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TopPageComponent } from './top-page/top-page.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FileDropperComponent } from './file-dropper/file-dropper.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SortableItemTileComponent } from './sortable-item-tile/sortable-item-tile.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { NewAnilistCharacterComponent } from './new-game-types/new-anilist-character/new-anilist-character.component';
import { NewAnilistStaffComponent } from './new-game-types/new-anilist-staff/new-anilist-staff.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { CustomErrorHandler } from './_services/error-handler';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { AnilistFavePickerComponent } from './new-game-types/parts/anilist-fave-picker/anilist-fave-picker.component';
import { AnilistTextboxPickerComponent } from './new-game-types/parts/anilist-textbox-picker/anilist-textbox-picker.component';
import { AnilistFiledropPickerComponent } from './new-game-types/parts/anilist-filedrop-picker/anilist-filedrop-picker.component';
import { GenericFiledropPickerComponent } from './new-game-types/parts/generic-filedrop-picker/generic-filedrop-picker.component';
import { NewGenericItemComponent } from './new-game-types/new-generic-item/new-generic-item.component';

@NgModule({
	declarations: [
		AppComponent,
		TopPageComponent,
		MainMenuComponent,
		GameMenuComponent,
		NewGameComponent,
		LoginPageComponent,
		NewGenericItemComponent,
		NewAnilistCharacterComponent,
		NewAnilistStaffComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		CommonModule,
		HttpClientModule,
		NgxFileDropModule,
		MatGridListModule,
		MatCardModule,
		MatButtonModule,
		MatListModule,
		MatToolbarModule,
		MatIconModule,
		MatDividerModule,
		FileDropperComponent,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		SortableItemTileComponent,
		MatTooltipModule,
		MatSnackBarModule,
		MatTabsModule,
		MatSelectModule,
		MatRadioModule,
		MatCheckboxModule,
		MatSliderModule,
		ErrorDialogComponent,
		MatMenuModule,
		AnilistFavePickerComponent,
		AnilistTextboxPickerComponent,
		AnilistFiledropPickerComponent,
		GenericFiledropPickerComponent
	],
	providers: [
		CookieService,
		provideAnimations(),
		{
			provide: ErrorHandler,
			useClass: CustomErrorHandler
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
