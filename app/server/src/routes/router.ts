import { router } from '../trpc.js';
import { loginRoute, registerRoute, googleLoginRoute } from './user/user-routes.js';
import { createSessionsRoute, deleteItemRoute, deleteSessionsRoute, getSessionDataRoute, getUserSessionsRoute, restartSessionsRoute, undoChoiceRoute, undoDeleteItemRoute, userChoiceRoute } from './session/session-routes.js';

export const appRouter = router({
    user: router({
        login: loginRoute,
        register: registerRoute,
        googleLogin: googleLoginRoute
    }),
    session: router({
        sessionManagement: router({
            getUserSessions: getUserSessionsRoute,
            createSession: createSessionsRoute,
            restartSessions: restartSessionsRoute,
            deleteSession: deleteSessionsRoute
        }),
        sessionInteraction: router({
            getSessionData: getSessionDataRoute,
            userChoice: userChoiceRoute,
            undoChoice: undoChoiceRoute,
            deleteItem: deleteItemRoute,
            undoDeleteItem: undoDeleteItemRoute
        })
    })
});

export type AppRouter = typeof appRouter;
