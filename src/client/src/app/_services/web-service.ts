import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GameResponse } from '../_objects/server/game-response';
import { SessionData, SessionList } from '../_objects/server/session-data';

@Injectable({providedIn:'root'})
export class WebService {

    static SERVER_URL = `http://home-server.local:6900`;

    constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

    getRequest<T>(url: string, checkPassword: boolean = true) {
        return this.http.get<T>(url, {
            headers: {}
        });
    }

    postRequest<T>(url: string, body?: any, checkPassword: boolean = true) {
        return this.http.post<T>(url, 
            body? body : {},
            {
                headers: {
                    'content-type': 'application/json'
                }
            });
    }

    deleteRequest<T>(url: string, checkPassword: boolean = true) {
        return this.http.delete<T>(url, {
            headers: {}
        });
    }

    ///////////////////////////////////////////////////////////////////////////////

    getSessions() {
        return this.getRequest<SessionList>(`${WebService.SERVER_URL}/sessions`);
    }

    createSession(name: string, type: string, items: string[]) {
        return this.postRequest<GameResponse>(`${WebService.SERVER_URL}/session`, {
            name: name,
            type: type,
            items: items
        });
    }

    restoreSession(sessionId: string) {
        return this.getRequest<GameResponse>(`${WebService.SERVER_URL}/session/${sessionId}`);
    }

    sendAnswer(sessionId: string, choice: boolean) {
        return this.postRequest<GameResponse>(`${WebService.SERVER_URL}/session/${sessionId}`, {
            choice: choice
        });
    }

    undoAnswer(sessionId: string) {
        return this.postRequest<GameResponse>(`${WebService.SERVER_URL}/session/${sessionId}/undo`);
    }

    getsessionData(sessionId: string) {
        return this.getRequest<SessionData>(`${WebService.SERVER_URL}/session/${sessionId}/data`);
    }
}
