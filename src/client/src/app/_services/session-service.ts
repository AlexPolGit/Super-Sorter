import { Injectable } from "@angular/core";
import { WebService } from "./web-service";
import { SessionData, SessionList } from "../_objects/server/session-data";
import { SortableObject } from "../_objects/sortables/sortable";

@Injectable({providedIn:'root'})
export class SessionService {

    constructor(private webService: WebService) {}
    
    getSessions() {
        return this.webService.getRequest<SessionList>(`session/all`);
    }

    createSession(name: string, type: string, items: string[], algorithm: string = "merge") {
        return this.webService.postRequest<SessionData>(`session/`, {
            name: name,
            type: type,
            items: items,
            algorithm: algorithm
        });
    }

    getSessionData(sessionId: string) {
        return this.webService.getRequest<SessionData>(`session/${sessionId}`);
    }

    sendAnswer(sessionId: string, itemA: SortableObject, itemB: SortableObject, choice: SortableObject, fullData: boolean = true) {
        return this.webService.postRequest<SessionData>(`session/${sessionId}`, {
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