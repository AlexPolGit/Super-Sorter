import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameResponse } from '../_objects/server/game-response';
import { SessionData, SessionList } from '../_objects/server/session-data';

@Injectable({providedIn:'root'})
export class WebService {

    static SERVER_URL = `http://home-server.local:6900`;

    constructor(private http: HttpClient) {}

    getRequest<T>(endpoint: string) {
        return this.http.get<T>(`${WebService.SERVER_URL}/${endpoint}`, {
            headers: {}
        });
    }

    postRequest<T>(endpoint: string, body?: any) {
        return this.http.post<T>(`${WebService.SERVER_URL}/${endpoint}`, 
            body? body : {},
            {
                headers: {
                    'content-type': 'application/json'
                }
            });
    }

    deleteRequest<T>(endpoint: string) {
        return this.http.delete<T>(`${WebService.SERVER_URL}/${endpoint}`, {
            headers: {}
        });
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
