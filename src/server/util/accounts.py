from util.logging import GLOBAL_LOGGER as logger
from objects.exceptions.base import BaseSorterException
from util.db.accounts import AccountsDataBase

class UserAlreadyExistsException(BaseSorterException):
    errorCode = 409
    def __init__(self, username: str) -> None:
        super().__init__(f"User already exists: {username}.")

class AccountManager:
    database: AccountsDataBase

    def __init__(self) -> None:
        self.database = AccountsDataBase()

    def tryLogin(self, username: str, password: str) -> bool:
        self.database.tryLogin(username, password)
        logger.info(f"User has logged in: {username}")
        return True
        
    def addUser(self, username: str, password: str) -> bool:
        if (self.userExists(username)):
            raise UserAlreadyExistsException(username)
        self.database.addUser(username, password)
        logger.info(f"Added new user: {username}")
        return True

    def userExists(self, username: str) -> bool:
        return self.database.userExists(username)
