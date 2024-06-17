import bcrypt
from uuid import uuid4
from sqlalchemy import update
from objects.exceptions.base import BaseSorterException
from db.database import SorterDataBase
from db.accounts.model import User

class UserNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, username: str) -> None:
        super().__init__(f"User not found: {username}.")

class PasswordIncorrectException(BaseSorterException):
    errorCode = 401
    def __init__(self, username: str) -> None:
        super().__init__(f"Incorrect password entered for user: {username}.")

class AccountsDataBase(SorterDataBase):

    def getUser(self, username: str) -> User:
        return self._selectOne(User, User.username == username)

    def getUsers(self) -> list[User]:
        return self._selectAll(User)

    def tryLogin(self, username: str, password: str) -> None:
        user = self.getUser(username)

        if (user == None):
            raise UserNotFoundException(username)

        hashedPassword = user.password.encode('utf8')
        correct = bcrypt.checkpw(password.encode('utf8'), hashedPassword)

        if (not correct):
            raise PasswordIncorrectException(username)

    def addUser(self, username: str, password: str, isGoogle: bool = False) -> None:
        hashedPassword = self.__hashPass(password)
        user = User(
            username = username,
            password = hashedPassword.decode('utf8'),
            admin = False,
            google = isGoogle,
        )
        self._insertOne(User, user, User.username)
    
    def updateUser(self, username: str, password: str = None, isAdmin: bool = None, isGoogle: bool = None):
        valuesToUpdate = {}

        if (not password == None):
            hashedPassword = self.__hashPass(password)
            valuesToUpdate["password"] = hashedPassword.decode('utf8')
        if (not isAdmin == None):
            valuesToUpdate["admin"] = isAdmin
        if (not isGoogle == None):
            valuesToUpdate["google"] = isGoogle

        self._updateOne(User, User.username == username, valuesToUpdate)

    def userExists(self, username: str):
        return self.getUser(username) != None
    
    def isAdmin(self, username) -> bool:
        user = self.getUser(username)
        return user.admin
    
    def createGoogleSession(self, userId: str) -> str:
        sessionSecret = str(uuid4())

        if self.userExists(userId):
            self.updateUser(userId, password = sessionSecret)
        else:
            self.addUser(userId, sessionSecret, True)
        
        return sessionSecret
    
    def __hashPass(self, password: str) -> bytes:
        hashablePassword = bytes(password, encoding='utf-8')
        return bcrypt.hashpw(hashablePassword, bcrypt.gensalt())
