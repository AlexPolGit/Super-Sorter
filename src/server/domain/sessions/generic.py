from flask import request
from util.logging import GLOBAL_LOGGER as logger
from domain.objects.exceptions.base import BaseSorterException
from database.generic_items import GenericItemDataBase
from domain.objects.models.generic_items import GenericItem

class UserNotAllowedException(BaseSorterException):
    errorCode = 403
    def __init__(self, query: str, current: str) -> None:
        super().__init__(f"User {current} is not allowed to get items for user {query}.")

class GenericItemsGame:
    itemsCache: dict[str, GenericItem]
    database: GenericItemDataBase

    def __init__(self) -> None:
        self.database = GenericItemDataBase()
        self.itemsCache = {}

    def addItems(self, items: list[dict]) -> list:
        currentUser = request.authorization.username
        return self.database.addGenericItems(items, currentUser)

    def getItems(self, ids: list[str]) -> list:
        requestedItems: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.itemsCache):
                logger.debug(f"Cache miss on generic item '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in generic item cache.")
                requestedItems.append(self.itemsCache.get(id).getMap())
        
        dbList = self.database.getGenericItems(notCached)

        for genericItem in dbList:
            requestedItems.append(genericItem.getMap())
            self.itemsCache[genericItem.id] = genericItem
            # logger.debug(f"Added to generic item cache: '{item.id}'")

        return requestedItems
