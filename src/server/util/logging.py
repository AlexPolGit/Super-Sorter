import logging
from colored import fore, style

class LogFormatter(logging.Formatter):
    BASE_FORMAT = "%(asctime)s [%(threadName)s] [%(levelname)s] %(message)s"

    FORMATS = {
        logging.DEBUG: fore("light_gray") + BASE_FORMAT,
        logging.INFO: fore("white") + BASE_FORMAT,
        logging.WARNING: style("italic") + fore("yellow") + BASE_FORMAT,
        logging.ERROR: style("italic") + fore("red") + BASE_FORMAT
    }

    def format(self, record):
        format = self.FORMATS.get(record.lineno)
        if (format == None):
            format = self.BASE_FORMAT
        formatter = logging.Formatter(format + style("reset"))
        return formatter.format(record)
    
GLOBAL_LOGGER = logging.getLogger()
GLOBAL_LOGGER.setLevel("DEBUG")

consoleLogger = logging.StreamHandler()
consoleLogger.setFormatter(LogFormatter())
GLOBAL_LOGGER.addHandler(consoleLogger)

GLOBAL_LOGGER.debug("Starting logger.")
