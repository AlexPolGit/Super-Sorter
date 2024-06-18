class BaseSorterException(Exception):
    type: str = "BaseSorterException"
    errorCode: int = 500

    def __init__(self, *args: object) -> None:
        super().__init__(*args)
        self.type = self.__class__.__name__

    def __str__(self) -> str:
        return f"[{self.type}] {self.args[0]}"
    
    def getType(self) -> str:
        return self.type

    def getErrorCode(self) -> int:
        return self.errorCode

class ServerError(BaseSorterException):
    def __init__(self, errorMessage: str) -> None:
        super().__init__(errorMessage)
