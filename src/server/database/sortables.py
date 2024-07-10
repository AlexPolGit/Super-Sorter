from sqlalchemy import and_
from database.sorter_database import SorterDataBase
from domain.objects.models.sortable import SortableItem, SortableItemType

class SortableItemDataBase(SorterDataBase):

    def getItems(self, ids: list[int], type: SortableItemType) -> list[SortableItem]:
        return self._selectMultiple(SortableItem, and_(SortableItem.id.in_(ids), SortableItem.type == type))

    def addItems(self, items: list[dict], type: SortableItemType) -> list[SortableItem]:
        itemsToAdd = []
        for item in items:
            sortableItem = SortableItem()
            sortableItem.id = item["id"]
            sortableItem.data = item["data"]
            sortableItem.type = type

            itemsToAdd.append(sortableItem)
        
        self._insertMultiple(itemsToAdd)
        newItemIds: list[str] = map(lambda item: item["id"], items)
        return self.getItems(newItemIds, type)
