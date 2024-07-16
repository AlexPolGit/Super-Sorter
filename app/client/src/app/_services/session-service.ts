import { Injectable } from "@angular/core";
import { WebService } from "./web-service";
import { SortableObject } from "../_objects/sortables/sortable";
import { AlgorithmTypes, SimpleSessionDto } from '../../../../lib/src/objects/session';
import { SortableItemTypes } from "../../../../lib/src/objects/sortable";

@Injectable({providedIn:'root'})
export class SessionService {

    constructor(private webService: WebService) {}
    
    async getSessions(): Promise<SimpleSessionDto[]> {
        return this.webService.server.session.sessionManagement.getUserSessions.query();
    }

    async createSession(name: string, type: SortableItemTypes, items: string[], algorithm: AlgorithmTypes = AlgorithmTypes.QUEUE_MERGE, shuffle: boolean = true) {
        return await this.webService.server.session.sessionManagement.createSession.mutate({
            name: name,
            type: type,
            items: items,
            algorithm: algorithm,
            shuffle: shuffle
        });
    }

    async deleteSession(sessionId: string) {
        return await this.webService.server.session.sessionManagement.deleteSession.mutate({
            sessionId: sessionId
        });
    }

    async getSessionData(sessionId: string) {
        return await this.webService.server.session.sessionInteraction.getSessionData.query({
            sessionId: sessionId
        });
    }

    // // This is a dangerous endpoint!
    // updateSession(sessionId: string, updateSessionObject: UpdateSession) {
    //     return this.webService.postRequest<SessionData>(`session/${sessionId}`, updateSessionObject);
    // }

    async sendAnswer(sessionId: string, itemA: SortableObject, itemB: SortableObject, choice: SortableObject, fullData: boolean = true) {
        return await this.webService.server.session.sessionInteraction.userChoice.mutate({
            sessionId: sessionId,
            choice: {
                itemA: itemA.getRepresentor(),
                itemB: itemB.getRepresentor(),
                choice: choice.getRepresentor()
            }
        });
    }

    async undoAnswer(sessionId: string, itemA: SortableObject, itemB: SortableObject, choice: SortableObject, fullData: boolean = true) {
        return await this.webService.server.session.sessionInteraction.undoChoice.mutate({
            sessionId: sessionId,
            choice: {
                itemA: itemA.getRepresentor(),
                itemB: itemB.getRepresentor(),
                choice: choice.getRepresentor()
            }
        });
    }

    restartSession(sessionId: string, fullData: boolean = true) {
        return this.webService.server.session.sessionManagement.restartSessions.mutate({
            sessionId: sessionId
        });
    }

    async deleteItem(sessionId: string, toDelete: SortableObject, fullData: boolean = true) {
        return await this.webService.server.session.sessionInteraction.deleteItem.mutate({
            sessionId: sessionId,
            item: toDelete.getRepresentor()
        });
    }

    async undeleteItem(sessionId: string, toUndelete: SortableObject, fullData: boolean = true) {
        return await this.webService.server.session.sessionInteraction.undoDeleteItem.mutate({
            sessionId: sessionId,
            item: toUndelete.getRepresentor()
        });
    }
}