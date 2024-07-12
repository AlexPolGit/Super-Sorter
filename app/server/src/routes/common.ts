import { SessionManager } from "../domain/session-manager.js";
import { UserManager } from "../domain/user-manager.js";

export const USER_MANAGER = new UserManager();
export const SESSION_MANAGER = new SessionManager();
