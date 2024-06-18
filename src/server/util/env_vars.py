import os
from business_logic.objects.exceptions.base import BaseSorterException

class EnvironmentVariableMissingException(BaseSorterException):
    errorCode = 500

    def __init__(self, envVarName: str) -> None:
        super().__init__(f"Environment variable not found: \"{envVarName}\".")

def getEnvironmentVariable(name: str, throwError: bool = True):
    value = os.environ.get(name)

    if (value == None):
        if (throwError):
            raise EnvironmentVariableMissingException(name)
        else:
            return None
    else:
        return value
