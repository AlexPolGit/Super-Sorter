import sqlite3

class DataBase:
    db_connection: sqlite3.Connection

    def __init__(self) -> None:
        self.db_connection = sqlite3.connect('../../data/sorter.db', check_same_thread = False)

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
