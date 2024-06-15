export enum ErrorType {
    NONE,
    USER,
    INTERFACE,
    SERVER
}

export class CustomError extends Error {
    errorType: ErrorType = ErrorType.NONE;
    errorName: string;
    errorTitle: string;
    errorData: any;
    status: number = -1;

    constructor(message: string, title: string = "", data: any = undefined) {
        super(message);
        this.errorName = this.constructor.name;
        this.errorTitle = title.length === 0 ? `[${this.errorType}]` : title;
        this.errorData = data;
    }
}

export class InterfaceError extends CustomError {
    override errorType: ErrorType = ErrorType.INTERFACE;
}

export class ServerError extends CustomError {
    override errorType: ErrorType = ErrorType.SERVER;
    statusText: string;

    constructor(message: string, status: number, statusText: string, title: string = "", data: any = undefined) {
        super(message, "Server Error", data = data);
        this.status = status;
        this.statusText = statusText;
    }
}

export class UserError extends CustomError {
    override errorType: ErrorType = ErrorType.USER;
    statusText: string = "";

    constructor(message: string, title: string = "", status?: number, statusText?: string, data: any = undefined) {
        super(message, title, data = data);
        this.status = status ? status : 0;
        this.statusText = statusText ? statusText : "";
    }
}
