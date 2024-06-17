import json
import random
from uuid import uuid4
from sqlalchemy import String, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column
from objects.sortable_item import SortableItem
from objects.sorts.sorter import Comparison
from db.database import Base

class Session(Base):
    __tablename__ = "session"
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

    def getJson(self) -> dict:
        return {
            "id": self.id,
            "owner": self.owner,
            "name": self.name,
            "type": self.type,
            "items": self.parseItems(self.items),
            "deleted_items": self.parseDeletedItems(self.deleted_items),
            "history": self.parseHistory(self.history),
            "deleted_history": self.parseDeletedHistory(self.deleted_history),
            "algorithm": self.algorithm,
            "seed": self.seed
        }

    def parseItems(raw: str) -> list[SortableItem]:
        items: list[SortableItem] = []
        itemStrings: list[str] = json.loads(raw)
        for i in itemStrings:
            items.append(SortableItem(i))
        return items
    
    def parseDeletedItems(raw: str) -> list[SortableItem]:
        deletedItems: list[SortableItem] = []
        deletedItemStrings: list[str] = json.loads(raw)
        for d in deletedItemStrings:
            deletedItems.append(SortableItem(d))
        return deletedItems

    def parseHistory(raw: str) -> list[Comparison]:
        history: list[Comparison] = []
        historyStrings: list[str] = json.loads(raw)
        for h in historyStrings:
            history.append(Comparison.fromRepresentation(h))
        return history
    
    def parseDeletedHistory(raw: str) -> list[Comparison]:
        deletedHistory: list[Comparison] = []
        deletedHistoryStrings: list[str] = json.loads(raw)
        for d in deletedHistoryStrings:
            deletedHistory.append(Comparison.fromRepresentation(d))
        return deletedHistory
    
    def __repr__(self) -> str:
        return f"Session(id={self.id}, owner={self.owner}, name={self.name}, type={self.type}, algorithm={self.algorithm}, seed={self.seed} | {len(self.items)} items, {len(self.deleted_items)} deleted_items, {len(self.history)} history, {len(self.deleted_history)} deleted_history)"
