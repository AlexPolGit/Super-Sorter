import { schedule } from "node-cron";
import { getEnvironmentVariable } from "../../../util/env.js";
import { getCurrentDate, getFormattedDate, secondsToMinutes } from "../../../util/logic.js";
import { saveStringToFile } from "../../../util/fileio.js";
import { SteamDataCleaner } from "./steam-data-cleaner.js";

const STEAM_CRON_SCHEDULE = getEnvironmentVariable("STEAM_CRON_SCHEDULE", false, "0 0 * * 0"); // Default: 00:00 on Sunday
const STEAM_CRON_REPORT_PATH = getEnvironmentVariable("STEAM_CRON_REPORT_PATH");

export function setupSteamCron() {
    console.log(`Starting Steam cron job with schedule: [${STEAM_CRON_SCHEDULE}]. Reports will be saved to "${STEAM_CRON_REPORT_PATH}".`);

    return schedule(STEAM_CRON_SCHEDULE, async () => {
        await runSteamCrom();
    },
    { timezone: "America/Toronto" });
}

async function runSteamCrom() {
    const steamDataCrawler = new SteamDataCleaner();
    const currentDate = getCurrentDate();
    
    console.warn(`[${currentDate}] STARTING STEAM CRON.`);

    const startTime = Date.now();
    const deletedItems = await steamDataCrawler.loadItemsFromSource();
    const endTime = Date.now();
    const elapsedTime = secondsToMinutes(Math.round((endTime - startTime) / 1000));

    console.warn(`[${currentDate}] COMPLETED STEAM CRON IN ${elapsedTime}.`);

    let reportContent = "Steam App ID,Steam App Name,Last Updated\n";
    deletedItems.forEach(item => {
        reportContent += `${item.id},${item.data.name},${getFormattedDate(item.data.lastUpdated)}\n`;
    });

    saveStringToFile(`${STEAM_CRON_REPORT_PATH}/${currentDate} [${elapsedTime}].csv`, reportContent);
}
