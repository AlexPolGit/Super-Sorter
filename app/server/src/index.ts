import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { panelRoute } from "./panel.js";
import { appRouter } from "./routes/router.js";
import { createContext } from "./trpc.js";
import { getEnvironmentVariable } from "./util/env.js";
import { fileRoute } from "./fileserve.js";

const SERVER_PORT = getEnvironmentVariable("SERVER_PORT");
const app = express();

const corsOptions = {
    origin: [`http://home-server:${SERVER_PORT}`, `http://home-server:6901`, `http://localhost:${SERVER_PORT}`, `http://localhost:6901`],
    credentials: true
};

app.use(cors(corsOptions));
app.use(
    "/api/trpc",
    createExpressMiddleware({
        router: appRouter,
        createContext,
        onError(opts) {
            const { error, type, path, input, ctx, req } = opts;
            console.error("Error:", error);
        },
    })
);
app.use("/", fileRoute);
app.use("/panel", panelRoute);

app.listen(SERVER_PORT, () => { 
    console.log("Server running at PORT: ", SERVER_PORT); 
});
