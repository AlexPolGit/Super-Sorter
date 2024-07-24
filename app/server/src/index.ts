import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { panelRoute } from "./panel.js";
import { appRouter } from "./routes/router.js";
import { createContext } from "./trpc.js";
import { getEnvironmentVariable } from "./util/env.js";
import { fileRoute } from "./fileserve.js";
import { setupSteamCron } from "./domain/loaders/steam/steam-cron.js"
import { populateSteamGamesOnStartup } from "./domain/loaders/steam/steam-populator.js"
export * from "./routes/router.js";

const SERVER_PORT = getEnvironmentVariable("SERVER_PORT");
const CLIENT_PORT = getEnvironmentVariable("CLIENT_PORT", false, "6901");
const NODE_ENV = getEnvironmentVariable<"development" | "production">("NODE_ENV");

const STEAM_CRON_TASK = setupSteamCron();
STEAM_CRON_TASK.start();
populateSteamGamesOnStartup(); // Do not await this function here.

const app = express();

const corsOptions = {
    origin: [`http://localhost:${SERVER_PORT}`, `http://localhost:${CLIENT_PORT}`],
    credentials: true
};

app.use(cors(corsOptions));
app.use("/panel", panelRoute);
app.use(
    "/api/trpc",
    createExpressMiddleware({
        router: appRouter,
        createContext,
        onError(opts) {
            const { error } = opts;
            console.error("Error:", error);
        }
    })
);
app.use("/", fileRoute);

app.listen(SERVER_PORT, () => { 
    console.log(`Server running on port ${SERVER_PORT}...`); 
});
