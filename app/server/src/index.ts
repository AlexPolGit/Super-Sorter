import express from 'express';
import cors from "cors";
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { panelRoute } from './panel.js';
import { appRouter } from './routes/router.js';
import { createContext } from './trpc.js';
import { getEnvironmentVariable } from './util/env.js';

const PORT = getEnvironmentVariable("PORT");
const app = express();

const corsOptions = {
    origin: ['http://home-server:3000', 'http://home-server:6901', 'http://localhost:3000', 'http://localhost:6901'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(
    '/api/trpc',
    createExpressMiddleware({
        router: appRouter,
        createContext
    })
);
app.use('/', panelRoute);

app.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
});
