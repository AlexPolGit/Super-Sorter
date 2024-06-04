import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuccessfulLoginOrRegister } from '../_objects/server/accounts';
import { GameResponse } from '../_objects/server/game-response';
import { SessionData, SessionList } from '../_objects/server/session-data';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class WebService {

    SERVER_URL: string;

    constructor(private http: HttpClient, private router: Router, private cookies: CookieService) {
        this.SERVER_URL = `http://${window.location.hostname}:6900`;
    }

    getUsernameAndPasswordHeaders(): {} {
        let username = this.cookies.get("username");
        let password = this.cookies.get("password");
        return {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        };
    }

    getRequest<T>(endpoint: string, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.get<T>(`${this.SERVER_URL}/${endpoint}`, {
            headers: headers
        });
    }

    postRequest<T>(endpoint: string, body?: any, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.post<T>(`${this.SERVER_URL}/${endpoint}`, 
            body? body : {},
            {
                headers: {...headers, ...{
                    'content-type': 'application/json'
                }}
            });
    }

    deleteRequest<T>(endpoint: string, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.delete<T>(`${this.SERVER_URL}/${endpoint}`, {
            headers: {}
        });
    }

    async checkLogin(): Promise<boolean> {
        let login = firstValueFrom(this.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: this.cookies.get("username"),
            password: this.cookies.get("password")
        }));

        try {
            let response = await login;
            // console.log(`Successfully logged in as "${response.username}".`)
            return true;
        }
        catch (error) {
            console.error(error);
            this.router.navigate(['/login']);
            return false;
        }
    }

    async login(username: string, password: string): Promise<boolean> {
        let login = firstValueFrom(this.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: username,
            password: password
        }));

        try {
            let response = await login;
            console.log(`Successfully logged in as "${response.username}".`)
            this.cookies.set("username", username);
            this.cookies.set("password", password);
            return true;
        }
        catch (error) {
            console.error(error)
            return false;
        }
    }

    async register(username: string, password: string): Promise<boolean> {
        let login = firstValueFrom(this.postRequest<SuccessfulLoginOrRegister>(`account/register`, {
            username: username,
            password: password
        }));

        try {
            let response = await login;
            console.log(`Successfully created account "${response.username}".`)
            this.cookies.set("username", username);
            this.cookies.set("password", password);
            return true;
        }
        catch (error) {
            console.error(error)
            return false;
        }
    }

    logout() {
        this.cookies.delete("username");
        this.cookies.delete("password");
        this.router.navigate(['/login']);
    }

    getCurrentUsername(): string {
        return this.cookies.get("username");
    }

    ///////////////////////////////////////////////////////////////////////////////

    getSessions() {
        return this.getRequest<SessionList>(`session/all`);
    }

    createSession(name: string, type: string, items: string[]) {
        return this.postRequest<GameResponse>(`session/`, {
            name: name,
            type: type,
            items: items
        });
    }

    restoreSession(sessionId: string) {
        return this.getRequest<GameResponse>(`session/${sessionId}`);
    }

    sendAnswer(sessionId: string, itemA: string, itemB: string, choice: boolean) {
        return this.postRequest<GameResponse>(`session/${sessionId}`, {
            itemA: itemA,
            itemB:itemB,
            choice: choice
        });
    }

    undoAnswer(sessionId: string) {
        return this.postRequest<GameResponse>(`session/${sessionId}/undo`);
    }

    deleteItem(sessionId: string, toDelete: string) {
        return this.postRequest<GameResponse>(`session/${sessionId}/undo/delete/${toDelete}`);
    }

    getsessionData(sessionId: string) {
        return this.getRequest<SessionData>(`session/${sessionId}/data`);
    }
}
