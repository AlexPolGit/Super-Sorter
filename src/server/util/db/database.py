import sqlite3
from flask import request

class DataBase:
    db_connection: sqlite3.Connection

    def __init__(self) -> None:
        self.db_connection = sqlite3.connect('../../data/sorter.db', check_same_thread = False)

    def execute(self, query: str):
        cursor = self.getCursor()
        cursor.execute(query)
        self.db_connection.commit()
        cursor.close()

    def fetchAll(self, query: str):
        cursor = self.getCursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        return rows

    def getCursor(self):
        return self.db_connection.cursor()
    
    def getUserName(self) -> str:
        return request.authorization.username
