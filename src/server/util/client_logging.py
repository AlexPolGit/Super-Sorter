from db.accounts.accounts import AccountsDataBase
from util.logging import GLOBAL_LOGGER as logger

class LogObject:
    username: str
    time: str
    level: str
    data: str

class ClientLogger():

    def __init__(self) -> None:
        self.database = AccountsDataBase()

    def saveLog(self, log: dict) -> bool:
        if (log["level"] == "warn"):
            logger.warn(f"Client Warning: [{log["time"]}] [{self.database.getUserName()}] {log["data"]}")
        elif (log["level"] == "error"):
            logger.error(f"Client Warning: [{log["time"]}] [{self.database.getUserName()}] {log["data"]}")
        return True
