import { inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { createTRPCProxyClient, httpLink, loggerLink } from '@trpc/client';
import { AppRouter } from '@sorter/server';
import { environment } from 'src/environment/environment';
import { InterfaceError } from '../_objects/custom-error';
import { UserCookieService } from './user-cookie-service';

export const HOST_NAME = `${window.location.hostname}`;
export const SERVER_URL = `${location.protocol}//${HOST_NAME}${environment.serverPort ? ":" + environment.serverPort : ""}`;
export const API_URL = `${SERVER_URL}/api/trpc`;
export const DOCS_URL = `${SERVER_URL}/panel`;

let AuthorizationHeader = '';

export const TRPC_PROVIDER = new InjectionToken<ReturnType<typeof createTRPCProxyClient<AppRouter>>>('___TRPC_PROVIDER___');
export const provideTRPCClient = (): Provider => ({
    provide: TRPC_PROVIDER,
    useFactory: () => {
        return createTRPCProxyClient<AppRouter>({
            links: [
                loggerLink({
                    enabled: () => !environment.isProd
                }),
                httpLink({
                    url: API_URL,
                    fetch(url, options) {
                        return fetch(url, {
                            ...options,
                            credentials: 'include'
                        });
                    },
                    headers() {
                        return {
                            Authorization: AuthorizationHeader,
                        };
                    }
                })
            ],
        });
    }
});
export const injectTRPCClient = (): ReturnType<typeof createTRPCProxyClient<AppRouter>> => inject(TRPC_PROVIDER);

@Injectable({providedIn:'root'})
export class WebService {

    public server;

    constructor(private cookies: UserCookieService) {
        this.server = injectTRPCClient();
    }

    setUsernameAndPasswordHeaders(): void {
        let localUsername = this.cookies.getCookie("username");
        let localPassword = this.cookies.getCookie("password");

        if (!localUsername || localUsername === "" || !localPassword || localPassword === "") {
            throw new InterfaceError("Missing username or password.", "Missing Credentials", { toLogin: true });
        }

        if (localUsername !== "" && localPassword !== "") {
            if (localUsername.startsWith("google:")) {
                localUsername = localUsername.split(":")[1];
            }

            AuthorizationHeader = 'Basic ' + btoa(`${localUsername}:${localPassword}`);
        }
        else {
            throw new InterfaceError("Tried to use invalid credentials", "Credential Error", { toLogin: true });
        }
    }
}
