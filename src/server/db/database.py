import os
import sqlite3
from util.env_vars import getEnvironmentVariable

class DataBase:
    db_connection: sqlite3.Connection

    def __init__(self) -> None:
        dbPath = str(os.path.abspath(getEnvironmentVariable("DATABASE_FILE_PATH")))
        self.db_connection = sqlite3.connect(dbPath, check_same_thread = False)

    def execute(self, query: str, parameters: tuple = ()):
        cursor = self.getCursor()
        cursor.execute(query, parameters)
        self.db_connection.commit()
        cursor.close()

    def fetchAll(self, query: str, parameters: tuple = ()):
        cursor = self.getCursor()
        cursor.execute(query, parameters)
        rows = cursor.fetchall()
        cursor.close()
        return rows

    def getCursor(self):
        return self.db_connection.cursor()
