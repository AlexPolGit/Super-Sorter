import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { LRUCache } from 'lru-cache'
import { UserData, UserDatabase, UserNotFoundException } from "../database/user-database.js";
import { BaseException } from "./exceptions/base.js";
import { getEnvironmentVariable } from '../util/env.js';

const googleClient = new OAuth2Client();
export const IS_NUMERIC = "^[0-9]+$"

export class UserAlreadyExistsException extends BaseException {
    constructor(username: string) {
        super("CONFLICT", `User already exists: "${username}".`);
    }
}

export class GoogleUserLoginFailedException extends BaseException {
    constructor() {
        super("FORBIDDEN", `Failed to login Google user. Please try again.`);
    }
}

export class UsernameInvalidException extends BaseException {
    constructor(username: string) {
        super("BAD_REQUEST", `The username "${username}" is invalid.`);
    }
}

export class PasswordInvalidException extends BaseException {
    constructor() {
        super("BAD_REQUEST", `This password is invalid.`);
    }
}

export class PasswordIncorrectException extends BaseException {
    constructor(username: string) {
        super("UNAUTHORIZED", `Incorrect password entered for user "${username}".`);
    }
}

export class UserManager {
    private userDatabase: UserDatabase;
    private GOOGLE_CLIENT_ID: string;
    private _userCache: LRUCache<string, UserData>;

    constructor() {
        this.userDatabase = new UserDatabase();
        this.GOOGLE_CLIENT_ID = getEnvironmentVariable("GOOGLE_APP_CLIENT_ID") as string;
        const cacheSize = parseInt(getEnvironmentVariable("USER_CACHE_SIZE", false, "1000"));
        this._userCache = new LRUCache({ max: cacheSize });
    }

    async userExists(username: string): Promise<boolean> {
        try {
            await this.findUser(username);
            return true;
        }
        catch (e: any) {
            if (e instanceof UserNotFoundException) {
                return false;
            }
            else {
                throw e;
            }
        }
    }

    async tryLogin(username: string, password: string) {
        username = username.trim();
        if (!this.usernameIsValid(username, false)) {
            throw new UsernameInvalidException(username);
        }
        if (!this.passwordIsValid(password)) {
            throw new PasswordInvalidException();
        }

        let user = await this.findUser(username);
        let validPassword = await this.checkPassword(password, user.password);

        if (!validPassword) {
            throw new PasswordIncorrectException(username);
        }
        
        return user;
    }

    async addUser(username: string, password: string) {
        username = username.trim();
        if (!this.usernameIsValid(username, true)) {
            throw new UsernameInvalidException(username);
        }
        if (!this.passwordIsValid(password)) {
            throw new PasswordInvalidException();
        }

        let userExists = await this.userExists(username);

        if (userExists) {
            throw new UserAlreadyExistsException(username);
        }

        console.log(`Added new user: ${username}`);

        return this.userDatabase.createUser({
            username: username,
            password: await this.hashPassword(password),
            admin: 0,
            google: 0
        });
    }

    async googleLogin(token: string) {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: this.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            if (payload) {
                const userId = payload['sub'];
                return await this.createGoogleSession(userId);
            }
            else {
                console.error(`Google payload error.`);
                throw new GoogleUserLoginFailedException();
            }
        }
        catch (e: any) {
            console.error(e);
            throw new GoogleUserLoginFailedException();
        }
    }

    async createGoogleSession(userId: string) {
        console.log(`Making Google session for user "${userId}".`);
        let sessionSecret = uuidv4();
        let userExists = await this.userExists(userId);

        if (userExists) {
            await this.userDatabase.updateUser({
                username: userId,
                password: await this.hashPassword(sessionSecret)
            });
        }
        else {
            await this.userDatabase.createUser({
                username: userId,
                password: await this.hashPassword(sessionSecret),
                admin: 0,
                google: 1
            });
        }

        return sessionSecret;
    }

    private async findUser(username: string): Promise<UserData> {
        const cacheResult = this._userCache.get(username);
        if (!cacheResult) {
            const user = await this.userDatabase.findUserByUsername(username);
            this._userCache.set(user.username, user);
            // console.log(`Got user from DB: "${user.username}".`);
            return user;
        }
        else {
            // console.log(`Got user from cache: "${cacheResult.username}".`);
            return cacheResult;
        }
    }

    private usernameIsValid(username: string, newUser: boolean = false) {
        if (username.length === 0) {
            return false;
        }
        if (newUser && username.length > 128) {
            return false;
        }
        if (newUser && username.match(IS_NUMERIC)) {
            return false;
        }

        return true;
    }
        
    private passwordIsValid(password: string) {
        if (password.length === 0) {
            return false;
        }
        if (password.length > 128) {
            return false;
        }
        return true;
    }

    private async checkPassword(userPassword: string, dbPassword: string) {
        return await bcrypt.compare(userPassword, dbPassword).then((result) => {
            return result;
        });
    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, await bcrypt.genSalt());
    }
}
