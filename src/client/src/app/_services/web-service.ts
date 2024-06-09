import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UserCookieService } from './user-cookie-service';
import { CustomError, ServerError, UserError } from '../_objects/custom-error';
import { environment } from 'src/environment/environment';

export const HOST_NAME = `${window.location.hostname}`;
export const SERVER_URL = `${location.protocol}//${HOST_NAME}${environment.serverPort ? ":" + environment.serverPort : ""}`;
export const API_URL = `${SERVER_URL}/api`;
export const DOCS_URL = `${API_URL}/docs`;

@Injectable({providedIn:'root'})
export class WebService {

    constructor(private http: HttpClient, private cookies: UserCookieService) {}

    getUsernameAndPasswordHeaders(): {} {
        let creds = this.cookies.getCurrentUser();
        let username = creds[0];
        let password = creds[1];
        return {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        };
    }

    getRequest<T>(endpoint: string, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.get<T>(`${API_URL}/${endpoint}`, {
            headers: headers
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => this.getAppropriateError(error));
            })
        );
    }

    postRequest<T>(endpoint: string, body?: any, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.post<T>(`${API_URL}/${endpoint}`, body? body : {}, {
            headers: {...headers, ...{
                'content-type': 'application/json'
            }}
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => this.getAppropriateError(error));
            })
        );
    }

    deleteRequest<T>(endpoint: string, body?: any, usePassword: boolean = true) {
        let headers = usePassword ? this.getUsernameAndPasswordHeaders() : {};
        return this.http.delete<T>(`${API_URL}/${endpoint}`, {
            headers: headers,
            body: body? body : {}
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => this.getAppropriateError(error));
            })
        );
    }

    getAppropriateError(error: HttpErrorResponse): CustomError {
        if (error.status >= 400 && error.status <= 499) {
            return new UserError(error.error.message, undefined, error.status, error.statusText);
        }
        else {
            return new ServerError(error.error.message, error.status, error.statusText);
        }
    }
}
