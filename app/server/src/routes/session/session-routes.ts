import { protectedProcedure } from "../../trpc.js";
import { SESSION_MANAGER } from "../common.js";
import { GET_SESSION_MODEL, CREATE_SESSION_MODEL, USER_CHOICE_MODEL, SINGLE_ITEM_MODEL } from "./session-models.js";

export const getUserSessionsRoute = protectedProcedure
    .query(async (opts) => {
        const { ctx } = opts;
        console.log(`Getting sessions for user: "${ctx.username}"`);
        const sessions = await SESSION_MANAGER.getSessionsForUser(ctx.username);    
        return sessions;
    });

export const createSessionsRoute = protectedProcedure
    .input(CREATE_SESSION_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        console.log(`Creating new session for user "${ctx.username}": ${input}`);
        const session = await SESSION_MANAGER.createSession(ctx.username, input);    
        return session;
    });

 export const deleteSessionsRoute = protectedProcedure
    .input(GET_SESSION_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        console.log(`Deleting session for user "${ctx.username}": ${input}`);
        const session = await SESSION_MANAGER.deleteSession(ctx.username, input.sessionId);    
        return session;
    });

export const getSessionDataRoute = protectedProcedure
    .input(GET_SESSION_MODEL)
    .query(async (opts) => {
        const { input, ctx } = opts;
        console.log(`Getting session data for user "${ctx.username}": ${input.sessionId}`);
        const session = await SESSION_MANAGER.getSessionData(ctx.username, input.sessionId);    
        return session;
    });

export const userChoiceRoute = protectedProcedure
    .input(USER_CHOICE_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        const session = await SESSION_MANAGER.runIteration(ctx.username, input.sessionId, input.choice);    
        return session;
    });

export const undoChoiceRoute = protectedProcedure
    .input(USER_CHOICE_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        const session = await SESSION_MANAGER.undo(ctx.username, input.sessionId, input.choice);    
        return session;
    });

export const deleteItemRoute = protectedProcedure
    .input(SINGLE_ITEM_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        const session = await SESSION_MANAGER.deleteItem(ctx.username, input.sessionId, input.item);    
        return session;
    });

export const undoDeleteItemRoute = protectedProcedure
    .input(SINGLE_ITEM_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        const session = await SESSION_MANAGER.undoDeleteItem(ctx.username, input.sessionId, input.item);    
        return session;
    });