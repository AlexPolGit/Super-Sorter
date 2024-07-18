import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export abstract class BaseException extends TRPCError {
    public readonly logMessage: string;

    constructor(errorCode: TRPC_ERROR_CODE_KEY, message: string) {
        super({ code: errorCode });
        this.message = this.constructor.name; 
        this.logMessage = message; 
    }

    override toString() {
        return `"${this.logMessage}" ${super.toString()}`;
    }
}

export class InternalServerException extends BaseException {
    constructor(message: string) {
        super("INTERNAL_SERVER_ERROR", message);
    }
}
