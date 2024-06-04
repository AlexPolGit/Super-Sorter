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

    static SERVER_URL = `http://home-server.local:6900`;

    constructor(private http: HttpClient, private router: Router, private cookies: CookieService) {}

    getUsernameAndPasswordHeaders(): {} {
        let username = this.cookies.get("username");
        let password = this.cookies.get("password");
        return {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        };
    }

    getRequest<T>(endpoint: string, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.get<T>(`${WebService.SERVER_URL}/${endpoint}`, {
            headers: headers
        });
    }

    postRequest<T>(endpoint: string, body?: any, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.post<T>(`${WebService.SERVER_URL}/${endpoint}`, 
            body? body : {},
            {
                headers: {...headers, ...{
                    'content-type': 'application/json'
                }}
            });
    }

    deleteRequest<T>(endpoint: string, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.delete<T>(`${WebService.SERVER_URL}/${endpoint}`, {
            headers: {}
        });
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

    sendAnswer(sessionId: string, choice: boolean) {
        return this.postRequest<GameResponse>(`session/${sessionId}`, {
            choice: choice
        });
    }

    undoAnswer(sessionId: string) {
        return this.postRequest<GameResponse>(`session/${sessionId}/undo`);
    }

    getsessionData(sessionId: string) {
        return this.getRequest<SessionData>(`session/${sessionId}/data`);
    }
}
