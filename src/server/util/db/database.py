import sqlite3

class DataBase:
    db_connection: sqlite3.Connection

    def __init__(self) -> None:
        self.db_connection = sqlite3.connect('../../data/sorter.db', check_same_thread = False)
        self.cursor = self.db_connection.cursor()

    def execute(self, query: str):
        cursor = self.getCursor()
        cursor.execute(query)
        self.db_connection.commit()

    def fetchAll(self, query: str):
        cursor = self.getCursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        return rows

    def getCursor(self):
        return self.db_connection.cursor()
