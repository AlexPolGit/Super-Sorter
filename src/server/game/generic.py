import json

from flask import request
from util.logging import GLOBAL_LOGGER as logger
from objects.exceptions.base import BaseSorterException
from db.accounts.accounts import AccountsDataBase
from db.generic_items.generic_items import GenericItemDataBase

class UserNotAllowedException(BaseSorterException):
    errorCode = 403
    def __init__(self, query: str, current: str) -> None:
        super().__init__(f"User {current} is not allowed to get items for user {query}.")

class GenericItem:
    def __init__(self, id: str, name: str, image: str, metadata: str) -> None:
        self.id = id
        self.name = name
        self.image = image
        self.metadata = metadata

    def asObject(self):
        return json.loads(json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o))))

class GenericItemsGame:
    itemsCache: dict[str, GenericItem]
    database: GenericItemDataBase
    accountsDataBase: AccountsDataBase

    def __init__(self) -> None:
        self.database = GenericItemDataBase()
        self.accountsDataBase = AccountsDataBase()
        self.itemsCache = {}

    def addItems(self, items: list[dict]) -> list:
        currentUser = request.authorization.username
        ids = self.database.addItems(items, currentUser)
        for i, item in enumerate(items):
            self.itemsCache[ids[i]] = GenericItem(ids[i], item['name'], item['image'], item['metadata'])
        return self.getItems(ids, currentUser)

    def getItems(self, ids: list[str], username: str = None) -> list:
        currentUser = request.authorization.username
        if (not username):
            username = currentUser
        elif ((currentUser != username) and (not self.accountsDataBase.isAdmin(currentUser))):
            logger.warning(f"User {currentUser} tried to access items for user {username}, but is not an admin.")
            raise UserNotAllowedException(username, currentUser) 

        requestedItems: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.itemsCache):
                logger.debug(f"Cache miss on generic item '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in generic item cache.")
                requestedItems.append(self.itemsCache.get(id).asObject())
        
        dbList = self.database.getItems(notCached, username)

        for item in dbList:
            genericItem = GenericItem(item.id, item.name, item.image, item.metadata)
            requestedItems.append(genericItem.asObject())
            self.itemsCache[item.id] = genericItem
            # logger.debug(f"Added to generic item cache: '{item.id}'")

        return requestedItems
