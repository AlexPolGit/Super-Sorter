import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export abstract class BaseException extends TRPCError {
    constructor(errorCode: TRPC_ERROR_CODE_KEY, message: string) {
        super({ code: errorCode, message: message });
    }
}

export class InternalServerException extends BaseException {
    constructor(message: string) {
        super("INTERNAL_SERVER_ERROR", message);
    }
}
