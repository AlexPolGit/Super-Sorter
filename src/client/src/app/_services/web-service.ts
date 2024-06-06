import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuccessfulLoginOrRegister } from '../_objects/server/accounts';
import { SessionData, SessionList } from '../_objects/server/session-data';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { UserCookieService } from './user-cookie-service';

@Injectable({providedIn:'root'})
export class WebService {

    SERVER_URL: string;

    constructor(private http: HttpClient, private router: Router, private cookies: UserCookieService) {
        this.SERVER_URL = `http://${window.location.hostname}:6900`;
    }

    getUsernameAndPasswordHeaders(): {} {
        let creds = this.cookies.getCurrentUser();
        let username = creds[0];
        let password = creds[1];
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
            headers: headers
        });
    }

    async checkLogin(): Promise<boolean> {
        let creds = this.cookies.getCurrentUser();
        let username = creds[0];
        let password = creds[1];
        let login = firstValueFrom(this.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: username,
            password: password
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
            this.cookies.setCurrentUser(username, password);
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
            this.cookies.setCurrentUser(username, password);
            return true;
        }
        catch (error) {
            console.error(error)
            return false;
        }
    }

    logout() {
        this.cookies.logoutUser();
        this.router.navigate(['/login']);
    }
    
    ///////////////////////////////////////////////////////////////////////////////

    getSessions() {
        return this.getRequest<SessionList>(`session/all`);
    }

    createSession(name: string, type: string, items: string[], algorithm: string = "merge") {
        return this.postRequest<SessionData>(`session/`, {
            name: name,
            type: type,
            items: items,
            algorithm: algorithm
        });
    }

    getSessionData(sessionId: string) {
        return this.getRequest<SessionData>(`session/${sessionId}`);
    }

    sendAnswer(sessionId: string, itemA: string, itemB: string, choice: string) {
        return this.postRequest<SessionData>(`session/${sessionId}`, {
            itemA: itemA,
            itemB: itemB,
            choice: choice
        });
    }

    undoAnswer(sessionId: string) {
        return this.postRequest<SessionData>(`session/${sessionId}/undo`);
    }

    restartSession(sessionId: string) {
        return this.postRequest<SessionData>(`session/${sessionId}/restart`);
    }

    deleteItem(sessionId: string, toDelete: string) {
        return this.postRequest<SessionData>(`session/${sessionId}/delete/${toDelete}`);
    }

    undeleteItem(sessionId: string, toUndelete: string) {
        return this.postRequest<SessionData>(`session/${sessionId}/undelete/${toUndelete}`);
    }
}
