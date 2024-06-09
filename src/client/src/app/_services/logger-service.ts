import { Injectable } from '@angular/core';
import { WebService } from './web-service';
import { environment } from 'src/environment/environment';

interface LogObject {
    time: string,
    level: string,
    data: string
}

@Injectable({providedIn:'root'})
export class LoggerService {

    constructor(private webService: WebService) {}

    debug(message: string, ...optionalParams: any[]) {
        let logMessage = this.formatMessage(message, optionalParams);
        if (!environment.isProd) {
            console.debug(logMessage);
        }
    }

    info(message: string, ...optionalParams: any[]) {
        let logMessage = this.formatMessage(message, optionalParams);
        if (!environment.isProd) {
            console.log(logMessage);
        }
    }

    warn(message: string, ...optionalParams: any[]) {
        let logMessage = this.formatMessage(message, optionalParams);
        console.warn(logMessage);
        if (environment.sendWarnLogs) {
            this.sendLog(logMessage, "warn");
        }
    }

    error(message: string, ...optionalParams: any[]) {
        let logMessage = this.formatMessage(message, optionalParams);
        console.error(logMessage);
        if (environment.sendErrorLogs) {
            this.sendLog(logMessage, "error");
        }
    }

    sendLog(message: string, level: "debug" | "info" | "warn" | "error") {
        let logObject: LogObject = {
            time: new Date().toLocaleString(),
            level: level,
            data: message
        };
        this.webService.postRequest<boolean>(`log/save`, logObject).subscribe((result: boolean) => {});
    }

    formatMessage(message: string, ...optionalParams: any[]) {
        return message.replace(/{([0-9]+)}/g, (match: any, index: number) => {
            return typeof optionalParams[index] === 'undefined' ? match : optionalParams[index];
        });
    }
}
