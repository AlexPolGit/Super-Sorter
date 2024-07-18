import { TRPCError, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { USER_MANAGER } from './routes/common.js';

export interface Context {
    username?: string;
    password?: string;
}

export async function createContext({req, res}: trpcExpress.CreateExpressContextOptions) {
    let context: Context = {};

    if (req.headers.authorization) {
        const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
        const [username, password] = Buffer.from(b64auth, "base64").toString().split(":");
        let login = await USER_MANAGER.tryLogin(username, password);

        if (login) {
            context.username = username;
            context.password = password;
        }
    }

    return context;
}

export type RequestContext = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<RequestContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
    const { ctx } = opts;
    if (!ctx.username || !ctx.password) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return opts.next({
        ctx: {
            username: ctx.username,
            password: ctx.password
        }
    });
});
