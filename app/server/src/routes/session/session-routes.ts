import { z } from 'zod';
import { SESSION_INTERACTION_MODEL, NEW_SESSION_MODEL, USER_CHOICE_MODEL, SIMPLE_INTERACTION_MODEL, SIMPLE_SESSION_MODEL, MIN_SESSION_MODEL, FULL_SESSION_MODEL } from "./session-models.js";
import { protectedProcedure } from "../../trpc.js";
import { SESSION_MANAGER } from "../common.js";

export const getUserSessionsRoute = protectedProcedure
    .output(z.array(SIMPLE_SESSION_MODEL))
    .query(async (opts) => {
        const { ctx } = opts;
        console.log(`Getting sessions for user: "${ctx.username}"`);
        const sessions = await SESSION_MANAGER.getSessionsForUser(ctx.username);    
        return sessions;
    });

export const createSessionsRoute = protectedProcedure
    .input(NEW_SESSION_MODEL)
    .output(MIN_SESSION_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        console.log(`Creating new session for user "${ctx.username}": ${input}`);
        const session = await SESSION_MANAGER.createSession(ctx.username, input);    
        return session;
    });

export const restartSessionsRoute = protectedProcedure
    .input(SESSION_INTERACTION_MODEL)
    .output(FULL_SESSION_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        console.log(`Restarting session for user "${ctx.username}": ${input.sessionId}`);
        const session = await SESSION_MANAGER.restartSession(ctx.username, input.sessionId);    
        return session;
    });

 export const deleteSessionsRoute = protectedProcedure
    .input(SESSION_INTERACTION_MODEL)
    .output(z.array(SIMPLE_SESSION_MODEL))
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        console.log(`Deleting session for user "${ctx.username}": ${input}`);
        const session = await SESSION_MANAGER.deleteSession(ctx.username, input.sessionId);    
        return session;
    });

export const getSessionDataRoute = protectedProcedure
    .input(SESSION_INTERACTION_MODEL)
    .output(FULL_SESSION_MODEL)
    .query(async (opts) => {
        const { input, ctx } = opts;
        console.log(`Getting session data for user "${ctx.username}": ${input.sessionId}`);
        const session = await SESSION_MANAGER.getSessionData(ctx.username, input.sessionId);    
        return session;
    });

export const userChoiceRoute = protectedProcedure
    .input(USER_CHOICE_MODEL)
    .output(MIN_SESSION_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        const session = await SESSION_MANAGER.runIteration(ctx.username, input.sessionId, input.choice);    
        return session;
    });

export const undoChoiceRoute = protectedProcedure
    .input(USER_CHOICE_MODEL)
    .output(FULL_SESSION_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        const session = await SESSION_MANAGER.undo(ctx.username, input.sessionId, input.choice);    
        return session;
    });

export const deleteItemRoute = protectedProcedure
    .input(SIMPLE_INTERACTION_MODEL)
    .output(FULL_SESSION_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        const session = await SESSION_MANAGER.deleteItem(ctx.username, input.sessionId, input.item);    
        return session;
    });

export const undoDeleteItemRoute = protectedProcedure
    .input(SIMPLE_INTERACTION_MODEL)
    .output(FULL_SESSION_MODEL)
    .mutation(async (opts) => {
        const { input, ctx } = opts;
        const session = await SESSION_MANAGER.undoDeleteItem(ctx.username, input.sessionId, input.item);    
        return session;
    });