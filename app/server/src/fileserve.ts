import path from "path";
import express, { Request, Response, NextFunction } from "express";
import { getEnvironmentVariable } from "./util/env.js";

export const fileRoute = express.Router();

const FILE_SERVE_DIRECTORY = getEnvironmentVariable("FILE_SERVE_DIRECTORY");

const locales: { [key: string]: string } = {
    "en-US": path.join(`${FILE_SERVE_DIRECTORY}/en-US`),
    "ja": path.join(`${FILE_SERVE_DIRECTORY}/ja`)
};

fileRoute.use("/:locale", (req: Request, res: Response, next: NextFunction) => {
    const locale = req.params.locale;
    if (locales[locale]) {
        express.static(locales[locale])(req, res, next);
    }
    else {
        res.status(404).send('Locale not supported');
    }
});

fileRoute.use(express.static("en-US"));

fileRoute.get("*", (req: Request, res: Response) => {
    const locale = req.params.locale || "en-US";
    const indexPath = path.join(locales[locale] || locales.en, "index.html");
    res.sendFile(indexPath);
});
