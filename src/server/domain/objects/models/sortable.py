import enum
import json
from sqlalchemy import String, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column
from database.sorter_database import Base

class SortableItemData:
    def getJson(self):
        jsonObj = json.loads(json.dumps(self, default = lambda o: getattr(o, '__dict__', str(o))))
        return jsonObj

class SortableItemType(enum.Enum):
    GENERIC_ITEM = "generic-items"
    ANILIST_CHARACTER = "anilist-character"
    ANILIST_STAFF = "anilist-staff"
    ANILIST_MEDIA = "anilist-media"
    SPOTIFY_SONG = "spotify-songs"

class SortableItem(Base):
    __tablename__ = "sortable"
    id: Mapped[str] = mapped_column(String(256), primary_key=True, nullable=False)
    type: Mapped[str] = mapped_column(Enum(SortableItemType, values_callable=lambda obj: [e.value for e in obj]), primary_key=True, nullable=False)
    data: Mapped[str] = mapped_column(JSON, nullable=True, default={})

    def __repr__(self) -> str:
        return f"SortableItem(id={self.id}, type={self.type}, data={json.dumps(self.data)})"
