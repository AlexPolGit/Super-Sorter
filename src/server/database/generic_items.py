import base64
from database.sorter_database import SorterDataBase
from domain.objects.models.generic_items import GenericItem

class GenericItemDataBase(SorterDataBase):

    def getGenericItems(self, ids: list[str]) -> list[GenericItem]:
        return self._selectMultiple(GenericItem, GenericItem.id.in_(ids))

    def addGenericItems(self, items: list[dict], username: str) -> list[str]:
        itemsToAdd = []
        ids = []
        for item in items:
            genericItem = GenericItem()
            genericItem.name = item["name"]
            genericItem.image = item["image"]
            genericItem.owner = username
            genericItem.id = f"{username}-{genericItem.name}-{base64.b64encode(genericItem.image.encode('utf8')).decode('utf8')}"
            ids.append(genericItem.id)
            if ("meta" in item):
                genericItem.meta = item["meta"] 
            itemsToAdd.append(genericItem)
        
        self._insertMultiple(itemsToAdd)
        return ids
