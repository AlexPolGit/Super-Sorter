import fetch from 'node-fetch';

export async function getRequest(url: string, headers: {[id: string]: string} = {}): Promise<any> {
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    return response.json();
}

export async function postRequest(url: string, data: any, headers: {[id: string]: string} = {}): Promise<any> {
    const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: headers
    });

    return response.json();
}
