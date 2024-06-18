import json
import random
from typing import ClassVar
from uuid import uuid4
from sqlalchemy import orm, String, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column
from database.sorter_database import Base
from business_logic.objects.exceptions.base import BaseSorterException
from business_logic.objects.sortable_item import SortableItem
from business_logic.objects.sorters.sorter import Comparison, Sorter
from business_logic.objects.sorters.sort_manager import getSortingAlgorithm

class ItemNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, id: str) -> None:
        super().__init__(f"Item not found: {id}.")

class Session(Base):
    __tablename__ = "session"

    # DB Fields
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=str(uuid4()))
    owner: Mapped[str] = mapped_column(String(256), nullable=False)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    type: Mapped[str] = mapped_column(String(64), nullable=False, default="generic")
    items: Mapped[str] = mapped_column(JSON, nullable=False, default=[])
    deleted_items: Mapped[str] = mapped_column(JSON, nullable=False, default=[])
    history: Mapped[str] = mapped_column(JSON, nullable=False, default=[])
    deleted_history: Mapped[str] = mapped_column(JSON, nullable=False, default=[])
    algorithm: Mapped[str] = mapped_column(String(64), nullable=False, default="queue-merge")
    seed: Mapped[int] = mapped_column(Integer, nullable=False, default=random.randint(0, 1000000000))

    # Computed Fields
    allItems: ClassVar[list[SortableItem]] = []
    allDeletedItems: ClassVar[list[SortableItem]] = []
    sorter: ClassVar[Sorter]

    @orm.reconstructor
    def init_on_load(self):
        self.allItems = self.__parseItems(self.items)
        self.allDeletedItems = self.__parseDeletedItems(self.deleted_items)
        self.sorter = getSortingAlgorithm(self.algorithm, self.__parseHistory(self.history), self.__parseDeletedHistory(self.deleted_history), self.seed)

    def runIteration(self, userChoice: Comparison | None = None):
        return self.sorter.doSort(self.allItems, userChoice)
        
    def undo(self, toUndo: Comparison):
        return self.sorter.undo(toUndo, self.allItems)
    
    def restart(self):
        self.allItems = self.allItems + self.allDeletedItems
        self.allDeletedItems = []
        return self.sorter.restart(self.allItems)
    
    def delete(self, toDelete: str):
        deleteIndex = -1
        for i, item in enumerate(self.allItems):
            if (item.getIdentifier() == toDelete):
                deleteIndex = i
                break
        if (deleteIndex == -1):
            raise ItemNotFoundException(toDelete)
        self.allDeletedItems.append(self.allItems.pop(deleteIndex))
        return self.sorter.deleteItem(self.allItems, toDelete)
    
    def undoDelete(self, toUndelete: str):
        undeleteIndex = -1
        for i, item in enumerate(self.allDeletedItems):
            if (item.getIdentifier() == toUndelete):
                undeleteIndex = i
                break
        if (undeleteIndex == -1):
            raise ItemNotFoundException(toUndelete)
        self.allItems.append(self.allDeletedItems.pop(undeleteIndex))
        return self.sorter.undeleteItem(self.allItems, toUndelete)
    
    def itemListAsRepresentation(self) -> str:
        items: list[str] = []
        for item in self.allItems:
            items.append(item.getIdentifier())
        return json.dumps(items)
    
    def deletedItemListAsRepresentation(self) -> str:
        deletedItems: list[str] = []
        for deletedItem in self.allDeletedItems:
            deletedItems.append(deletedItem.getIdentifier())
        return json.dumps(deletedItems)

    def __parseItems(self, itemStrings: list[str]) -> list[SortableItem]:
        items: list[SortableItem] = []
        for i in itemStrings:
            items.append(SortableItem(i))
        return items
    
    def __parseDeletedItems(self, deletedItemStrings: list[str]) -> list[SortableItem]:
        deletedItems: list[SortableItem] = []
        for d in deletedItemStrings:
            deletedItems.append(SortableItem(d))
        return deletedItems

    def __parseHistory(self, historyStrings: list[str]) -> list[Comparison]:
        history: list[Comparison] = []
        for h in historyStrings:
            history.append(Comparison.fromRepresentation(h))
        return history
    
    def __parseDeletedHistory(self, deletedHistoryStrings: list[str]) -> list[Comparison]:
        deletedHistory: list[Comparison] = []
        for d in deletedHistoryStrings:
            deletedHistory.append(Comparison.fromRepresentation(d))
        return deletedHistory
    
    def __repr__(self) -> str:
        return f"Session(id={self.id}, owner={self.owner}, name={self.name}, type={self.type}, algorithm={self.algorithm}, seed={self.seed} | {len(self.items)} items, {len(self.deleted_items)} deleted_items, {len(self.history)} history, {len(self.deleted_history)} deleted_history)"
