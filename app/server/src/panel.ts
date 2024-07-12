import express from "express";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "./routes/router.js";

export const panelRoute = express.Router();

panelRoute.use("/panel", (_, res) => {
    return res.send(renderTrpcPanel(appRouter, { url: "http://localhost:7000/api/trpc" }));
});
