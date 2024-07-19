import fetch, { Response } from 'node-fetch';
import { BaseException } from '../domain/exceptions/base.js';

export class HttpResponseException extends BaseException {
    response: Response;
    constructor(response: Response) {
        super("INTERNAL_SERVER_ERROR", `Server error from internal HTTP endpoint.`);
        this.response = response;
    }
}

export async function getRequest(url: string, headers: {[id: string]: string} = {}): Promise<any> {
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    return processResult(response);
}

export async function postRequest(url: string, data: any, headers: {[id: string]: string} = {}): Promise<any> {
    const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: headers
    });

    return processResult(response);
}

function processResult(response: Response) {
    if (response.ok) {
		return response.json();
	}
    else {
		throw new HttpResponseException(response);
	}
}
