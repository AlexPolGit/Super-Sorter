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
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
import { NewAnilistCharacterComponent } from './new-game-item-selectors/new-anilist-character/new-anilist-character.component';
import { NewAnilistStaffComponent } from './new-game-item-selectors/new-anilist-staff/new-anilist-staff.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { CustomErrorHandler } from './_services/error-handler';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { AnilistTextboxPickerComponent } from './new-game-item-selectors/_parts/anilist-textbox-picker/anilist-textbox-picker.component';
import { AnilistFiledropPickerComponent } from './new-game-item-selectors/_parts/anilist-filedrop-picker/anilist-filedrop-picker.component';
import { GenericFiledropPickerComponent } from './new-game-item-selectors/_parts/generic-filedrop-picker/generic-filedrop-picker.component';
import { NewGenericItemComponent } from './new-game-item-selectors/new-generic-item/new-generic-item.component';
import { NewAnilistMediaComponent } from './new-game-item-selectors/new-anilist-media/new-anilist-media.component';
import { NewSpotifySongsComponent } from './new-game-item-selectors/new-spotify-songs/new-spotify-songs.component';
import { SpotifyPlaylistPickerComponent } from './new-game-item-selectors/_parts/spotify-playlist-picker/spotify-playlist-picker.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataLoaderComponent } from './new-game-item-selectors/_parts/data-loader-component';
import { AnilistListPickerComponent } from './new-game-item-selectors/_parts/anilist-list-picker/anilist-list-picker.component';
import { AnilistFavouritesPickerComponent } from './new-game-item-selectors/_parts/anilist-favourites-picker/anilist-favourites-picker.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { ImportSessionComponent } from './import-session/import-session.component';
import { AnilistCharacterListComponent } from './new-game-item-list/anilist-character-list/anilist-character-list.component';
import { AnilistCharacterFilter } from './new-game-item-list/_filters/anilist-character-filter';
import { AnilistStaffFilter } from './new-game-item-list/_filters/anilist-staff-filter';
import { AnilistStaffListComponent } from './new-game-item-list/anilist-staff-list/anilist-staff-list.component';
import { GenericItemFilter } from './new-game-item-list/_filters/generic-item-filter';
import { AnilistMediaFilter } from './new-game-item-list/_filters/anilist-media-filter';
import { SpotifySongFilter } from './new-game-item-list/_filters/spotify-song-filter';
import { GenericItemListComponent } from './new-game-item-list/generic-item-list/generic-item-list.component';
import { AnilistMediaListComponent } from './new-game-item-list/anilist-media-list/anilist-media-list.component';
import { SpotifySongListComponent } from './new-game-item-list/spotify-song-list/spotify-song-list.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule} from '@angular/material/chips';
import { SelectDeselectComponentComponent } from './new-game-item-list/_select-deselect/select-deselect-component.component';

@NgModule({
	declarations: [
		AppComponent,
		TopPageComponent,
		MainMenuComponent,
		GameMenuComponent,
		NewGameComponent,
		LoginPageComponent,
		ImportSessionComponent,
		NewGenericItemComponent,
		NewAnilistCharacterComponent,
		NewAnilistStaffComponent,
		NewAnilistMediaComponent,
		NewSpotifySongsComponent,
		TopBarComponent,
		UserSettingsComponent,
		DataLoaderComponent,
		GenericItemListComponent,
		AnilistCharacterListComponent,
		AnilistStaffListComponent,
		AnilistMediaListComponent,
		SpotifySongListComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		CommonModule,
		HttpClientModule,
		BrowserAnimationsModule,
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
		AnilistListPickerComponent,
		AnilistFavouritesPickerComponent,
		AnilistTextboxPickerComponent,
		AnilistFiledropPickerComponent,
		GenericFiledropPickerComponent,
		SpotifyPlaylistPickerComponent,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		SocialLoginModule,
		GoogleSigninButtonModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatAutocompleteModule,
		MatChipsModule,
		SelectDeselectComponentComponent
	],
	providers: [
		MatDatepickerModule,
		MatNativeDateModule, 
		CookieService,
		GenericItemFilter,
		AnilistCharacterFilter,
		AnilistStaffFilter,
		AnilistMediaFilter,
		SpotifySongFilter,
		provideAnimations(),
		provideAnimationsAsync(),
		{
			provide: ErrorHandler,
			useClass: CustomErrorHandler
		},
		{
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				lang: 'en',
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(
							'117024688952-m91jofl4c3t195gucgl1ejoa6c8ahcvj.apps.googleusercontent.com',
							{
								oneTapEnabled: true
							}
						)
					}
				],
				onError: (err) => {
					console.error(err);
				}
			} as SocialAuthServiceConfig,
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
