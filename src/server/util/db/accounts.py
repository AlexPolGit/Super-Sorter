import bcrypt
from objects.exceptions.base import BaseSorterException
from util.db.database import DataBase

class UserNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, username: str) -> None:
        super().__init__(f"User not found: {username}.")

class PasswordIncorrectException(BaseSorterException):
    errorCode = 401
    def __init__(self, username: str) -> None:
        super().__init__(f"Incorrect password entered for user: {username}.")

class AccountsDataBase(DataBase):

    def __init__(self) -> None:
        super().__init__()

    def tryLogin(self, username: str, password: str):
        query = f"SELECT password FROM user WHERE username = '{username}'"
        res = self.fetchAll(query)

        if (len(res) == 0):
            raise UserNotFoundException(username)

        hashedPassword = res[0][0].encode('utf8')
        correct = bcrypt.checkpw(password.encode('utf8'), hashedPassword)

        if (not correct):
            raise PasswordIncorrectException(username)
        
    def addUser(self, username: str, password: str):
        hashablePassword = bytes(password, encoding='utf-8')
        hashedPassword = bcrypt.hashpw(hashablePassword, bcrypt.gensalt())
        query = f"INSERT INTO user (username, password) VALUES ('{username}', '{hashedPassword.decode('utf8')}')"
        self.execute(query)

    def userExists(self, username: str):
        query = f"SELECT username FROM user WHERE username = '{username}'"
        res = self.fetchAll(query)

        return len(res) > 0

