import { Injectable } from "@angular/core";
import { WebService } from "./web-service";
import { UpdateSession } from "../_objects/server/session-data";
import { SortableObject } from "../_objects/sortables/sortable";
import type { MinSession, SimpleSession, FullSession } from '@sorter/api/src/objects/session.js';

@Injectable({providedIn:'root'})
export class SessionService {

    constructor(private webService: WebService) {}
    
    async getSessions(): Promise<SimpleSession[]> {
        return this.webService.server.session.getUserSessions.query();
    }

    createSession(name: string, type: string, items: string[], algorithm: string = "queue-merge", shuffle: boolean = true) {
        return this.webService.postRequest<SessionData>(`session/`, {
            name: name,
            type: type,
            items: items,
            algorithm: algorithm,
            shuffle: shuffle
        });
    }

    deleteSession(sessionId: string) {
        return this.webService.deleteRequest<SessionList>(`session/`, {
            id: sessionId,
        });
    }

    getSessionData(sessionId: string) {
        return this.webService.getRequest<SessionData>(`session/${sessionId}`);
    }

    // This is a dangerous endpoint!
    updateSession(sessionId: string, updateSessionObject: UpdateSession) {
        return this.webService.postRequest<SessionData>(`session/${sessionId}`, updateSessionObject);
    }

    sendAnswer(sessionId: string, itemA: SortableObject, itemB: SortableObject, choice: SortableObject, fullData: boolean = true) {
        return this.webService.postRequest<SessionData>(`session/${sessionId}/choice`, {
            itemA: itemA.getRepresentor(),
            itemB: itemB.getRepresentor(),
            choice: choice.getRepresentor(),
            fullData: fullData
        });
    }

    undoAnswer(sessionId: string, itemA: SortableObject, itemB: SortableObject, choice: SortableObject, fullData: boolean = true) {
        return this.webService.postRequest<SessionData>(`session/${sessionId}/undo`, {
            itemA: itemA.getRepresentor(),
            itemB: itemB.getRepresentor(),
            choice: choice.getRepresentor(),
            fullData: fullData
        });
    }

    restartSession(sessionId: string, fullData: boolean = true) {
        return this.webService.postRequest<SessionData>(`session/${sessionId}/restart`, 
            {
                fullData: fullData
            }
        );
    }

    deleteItem(sessionId: string, toDelete: SortableObject, fullData: boolean = true) {
        return this.webService.postRequest<SessionData>(`session/${sessionId}/delete/${toDelete.getRepresentor()}`, 
            {
                fullData: fullData
            }
        );
    }

    undeleteItem(sessionId: string, toUndelete: SortableObject, fullData: boolean = true) {
            return this.webService.postRequest<SessionData>(`session/${sessionId}/undelete/${toUndelete.getRepresentor()}`, 
            {
                fullData: fullData
            }
        );
    }
}