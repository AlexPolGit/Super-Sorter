import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopPageComponent } from './top-page/top-page.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginPageComponent,
        title: $localize`:@@page-title-login:Login`
    },
    {
        path: '',
        component: TopPageComponent,
        title: 'Sorter',
        children: [
            {
                path: '',
                component: MainMenuComponent,
                title: $localize`:@@page-title-main-page:Super Sorter`
            },
            {
                path: 'game',
                component: GameMenuComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
