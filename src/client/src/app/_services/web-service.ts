import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuccessfulLoginOrRegister } from '../_objects/server/accounts';
import { SessionData, SessionList } from '../_objects/server/session-data';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserCookieService } from './user-cookie-service';
import { CustomError, ServerError, UserError } from '../_objects/custom-error';
import { SortableObject } from '../_objects/sortables/sortable';

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
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => this.getAppropriateError(error));
            })
        );
    }

    postRequest<T>(endpoint: string, body?: any, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.post<T>(`${this.SERVER_URL}/${endpoint}`, body? body : {}, {
            headers: {...headers, ...{
                'content-type': 'application/json'
            }}
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => this.getAppropriateError(error));
            })
        );
    }

    deleteRequest<T>(endpoint: string, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.delete<T>(`${this.SERVER_URL}/${endpoint}`, {
            headers: headers
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => this.getAppropriateError(error));
            })
        );
    }

    getAppropriateError(error: HttpErrorResponse): CustomError {
        if (error.status >= 400 && error.status <= 499) {
            return new UserError(error.error.message, undefined, error.status, error.statusText);
        }
        else {
            return new ServerError(error.error.message, error.status, error.statusText);
        }
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
            this.router.navigate(['/login']);
            return false;
        }
    }

    async login(username: string, password: string): Promise<boolean> {
        let login = firstValueFrom(this.postRequest<SuccessfulLoginOrRegister>(`account/login`, {
            username: username,
            password: password
        }));

        let response = await login;
        console.log(`Successfully logged in as "${response.username}".`);
        this.cookies.setCurrentUser(username, password);
        return true;
    }

    async register(username: string, password: string): Promise<boolean> {
        let register = firstValueFrom(this.postRequest<SuccessfulLoginOrRegister>(`account/register`, {
            username: username,
            password: password
        }));

        let response = await register;
        console.log(`Successfully created account "${response.username}".`);
        this.cookies.setCurrentUser(username, password);
        return true;
    }

    isLoggedIn(): boolean {
        let creds = this.cookies.getCurrentUser();
        return creds[0].length > 0 && creds[1].length > 0;
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

    sendAnswer(sessionId: string, itemA: SortableObject, itemB: SortableObject, choice: SortableObject) {
        return this.postRequest<SessionData>(`session/${sessionId}`, {
            itemA: itemA.getRepresentor(),
            itemB: itemB.getRepresentor(),
            choice: choice.getRepresentor()
        });
    }

    undoAnswer(sessionId: string, itemA: SortableObject, itemB: SortableObject, choice: SortableObject) {
        return this.postRequest<SessionData>(`session/${sessionId}/undo`, {
            itemA: itemA.getRepresentor(),
            itemB: itemB.getRepresentor(),
            choice: choice.getRepresentor()
        });
    }

    restartSession(sessionId: string) {
        return this.postRequest<SessionData>(`session/${sessionId}/restart`);
    }

    deleteItem(sessionId: string, toDelete: SortableObject) {
        return this.postRequest<SessionData>(`session/${sessionId}/delete/${toDelete.getRepresentor()}`);
    }

    undeleteItem(sessionId: string, toUndelete: SortableObject) {
        return this.postRequest<SessionData>(`session/${sessionId}/undelete/${toUndelete.getRepresentor()}`);
    }
}
