import { BaseException } from "../domain/exceptions/base.js";

export class EnvironmentVariableNotFoundException extends BaseException {
    constructor(name: string) {
        super("INTERNAL_SERVER_ERROR", `Could not find environment variable: "${name}"`);
    }
}

export function getEnvironmentVariable<T extends string>(name: string, throwError: boolean = true, defaultValue: string = ""): T {
    let value = process.env[name];
    if (!value) {
        if (throwError) {
            throw new EnvironmentVariableNotFoundException(name);
        }
        else {
            return defaultValue as T;
        }
    }

    return value as T;
}
