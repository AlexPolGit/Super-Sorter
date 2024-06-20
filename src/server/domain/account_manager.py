from google.oauth2 import id_token
from google.auth.transport import requests
from util.logging import GLOBAL_LOGGER as logger
from util.env_vars import getEnvironmentVariable
from domain.objects.exceptions.base import BaseSorterException
from database.accounts import AccountsDataBase

class UserAlreadyExistsException(BaseSorterException):
    errorCode = 409
    def __init__(self, username: str) -> None:
        super().__init__(f"User already exists: {username}.")

class GoogleUserLoginFailedException(BaseSorterException):
    errorCode = 403
    def __init__(self) -> None:
        super().__init__(f"Failed to login Google user. Please try again.")

class UsernameInvalidException(BaseSorterException):
    errorCode = 400
    def __init__(self) -> None:
        super().__init__(f"This username is invalid.")

class PasswordInvalidException(BaseSorterException):
    errorCode = 400
    def __init__(self) -> None:
        super().__init__(f"This password is invalid.")

class AccountManager:
    database: AccountsDataBase
    googleClientId: str

    def __init__(self) -> None:
        self.database = AccountsDataBase()
        self.googleClientId = getEnvironmentVariable("GOOGLE_APP_CLIENT_ID")

    def tryLogin(self, username: str, password: str) -> bool:
        self.database.tryLogin(username, password)
        return True
        
    def addUser(self, username: str, password: str) -> str:
        username = username.strip()
        if (not self.usernameIsValid(username)):
            raise UsernameInvalidException()
        
        if (not self.passwordIsValid(password)):
            raise PasswordInvalidException()

        if (self.userExists(username)):
            raise UserAlreadyExistsException(username)
        
        self.database.addUser(username, password)
        logger.info(f"Added new user: {username}")
        return password

    def userExists(self, username: str) -> bool:
        return self.database.userExists(username)
    
    def googleLogin(self, token: str) -> str:
        logger.debug(f"Making Google login with token \"{token}\"")
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), self.googleClientId)
            userId = idinfo['sub']
            return self.database.createGoogleSession(userId)
        except ValueError:
            raise GoogleUserLoginFailedException()
    
    def usernameIsValid(self, username: str) -> bool:
        if (len(username) == 0):
            return False
        if (len(username) > 128):
            return False
        elif (username.isnumeric()):
            return False
        else:
            return True
        
    def passwordIsValid(self, password: str) -> bool:
        if (len(password) == 0):
            return False
        if (len(password) > 128):
            return False
        else:
            return True
