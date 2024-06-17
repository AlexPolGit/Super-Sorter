import base64
from db.database import SorterDataBase
from db.generic_items.model import GenericItem

class GenericItemDataBase(SorterDataBase):

    def getGenericItems(self, ids: list[int]) -> list[GenericItem]:
        return self._selectMultiple(GenericItem, GenericItem.id.in_(ids))

    def addGenericItems(self, username: str, items: list[dict]):
        itemsToAdd = []
        for item in items:
            genericItem = GenericItem()
            genericItem.name = item["name"]
            genericItem.image = item["image"]
            genericItem.owner = username
            genericItem.id = f"{username}-{genericItem.name}-{base64.b64encode(genericItem.image.encode('utf8')).decode('utf8')}"
            if ("meta" in item):
                genericItem.meta = item["meta"] 
            itemsToAdd.append(genericItem)
        
        self._insertMultiple(itemsToAdd)
