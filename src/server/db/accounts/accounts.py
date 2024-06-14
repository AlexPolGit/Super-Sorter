import bcrypt
from uuid import uuid4
from objects.exceptions.base import BaseSorterException
from db.database import DataBase

class UserNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, username: str) -> None:
        super().__init__(f"User not found: {username}.")

class PasswordIncorrectException(BaseSorterException):
    errorCode = 401
    def __init__(self, username: str) -> None:
        super().__init__(f"Incorrect password entered for user: {username}.")

class AccountsDataBase(DataBase):

    def tryLogin(self, username: str, password: str):
        query = f"SELECT password FROM user WHERE username = '{username}'"
        res = self.fetchAll(query)

        if (len(res) == 0):
            raise UserNotFoundException(username)

        hashedPassword = res[0][0].encode('utf8')
        correct = bcrypt.checkpw(password.encode('utf8'), hashedPassword)

        if (not correct):
            raise PasswordIncorrectException(username)
        
    def addUser(self, username: str, password: str, isGoogle: bool = False):
        hashedPassword = self._hashPass(password)
        query = f"INSERT INTO user (username, password, google) VALUES ('{username}', '{hashedPassword.decode('utf8')}', {1 if isGoogle else 0})"
        self.execute(query)

    def userExists(self, username: str):
        query = f"SELECT * FROM user WHERE username = '{username}'"
        res = self.fetchAll(query)
        return len(res) > 0
    
    def isAdmin(self, username):
        query = f"SELECT admin FROM user WHERE username = '{username}'"
        res = self.fetchAll(query)
        return res[0] == 1
    
    def createGoogleSession(self, userId: str) -> str:
        sessionSecret = str(uuid4())

        if self.userExists(userId):
            hashedPassword = self._hashPass(sessionSecret)
            query = f"UPDATE user SET password = '{hashedPassword.decode('utf8')}' WHERE username = '{userId}'"
            self.execute(query)
        else:
            self.addUser(userId, sessionSecret, True)
        
        return sessionSecret
    
    def _hashPass(self, password: str) -> bytes:
        hashablePassword = bytes(password, encoding='utf-8')
        return bcrypt.hashpw(hashablePassword, bcrypt.gensalt())
