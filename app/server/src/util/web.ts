import fetch, { Response } from 'node-fetch';
import { BaseException } from '../domain/exceptions/base.js';

export class HttpResponseException extends BaseException {
    response: Response;
    constructor(response: Response) {
        super("INTERNAL_SERVER_ERROR", `Server error from internal HTTP endpoint.`);
        this.response = response;
    }
}

export async function getRequest(url: string, headers: {[id: string]: string} = {}, retries: number = 0, sleep: number = 2000): Promise<any> {
    return await tryLoop(() => fetch(url, {
        method: 'GET',
        headers: headers
    }), retries, sleep);
}

export async function postRequest(url: string, data: any, headers: {[id: string]: string} = {}, retries: number = 0, sleep: number = 2000): Promise<any> {
    return await tryLoop(() => fetch(url, {
        method: 'POST',
        body: data,
        headers: headers
    }), retries, sleep);
}

async function tryLoop(fxn: () => Promise<Response>, retries: number, sleep: number) {
    while (true) {
        try {
            return processResult(await fxn());
        }
        catch (e) {
            if (e instanceof HttpResponseException) {
                if (retries > 0) {
                    await new Promise(f => setTimeout(f, sleep));
                    retries--;
                }
                else {
                    throw e;
                }
            }
            else {
                throw e;
            }
        }
    }
}

function processResult(response: Response) {
    if (response.ok) {
		return response.json();
	}
    else {
		throw new HttpResponseException(response);
	}
}
