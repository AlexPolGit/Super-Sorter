import { publicProcedure } from "../../trpc.js";
import { USER_MANAGER } from "../common.js";
import { GOOGLE_LOGIN_MODEL, GOOGLE_LOGIN_RESULT, LOGIN_MODEL, LOGIN_RESULT } from "./user-models.js";

export const loginRoute = publicProcedure
    .input(LOGIN_MODEL)
    .output(LOGIN_RESULT)
    .query(async ({ input }) => {
        let user = await USER_MANAGER.tryLogin(input.username, input.password);    
        return {
            username: user.username
        };
    });

export const registerRoute = publicProcedure
    .input(LOGIN_MODEL)
    .output(LOGIN_RESULT)
    .mutation(async ({ input }) => {
        let newUser = await USER_MANAGER.addUser(input.username, input.password);    
        return {
            username: newUser.username
        };
    });

export const googleLoginRoute = publicProcedure
    .input(GOOGLE_LOGIN_MODEL)
    .output(GOOGLE_LOGIN_RESULT)
    .query(async ({ input }) => {
        console.log(input);
        let sessionSecret = await USER_MANAGER.googleLogin(input.token);    
        return {
            sessionSecret: sessionSecret
        };
    });
