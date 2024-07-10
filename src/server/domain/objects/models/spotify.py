from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from database.sorter_database import Base
from domain.objects.models.sortable import SortableItemData

# class SpotifySong(Base):
#     __tablename__ = "spotify-song"
#     id: Mapped[str] = mapped_column(String(64), primary_key=True, nullable=False)
#     name: Mapped[str] = mapped_column(String(256), nullable=False)
#     image: Mapped[str] = mapped_column(String(256), nullable=True)
#     uri: Mapped[str] = mapped_column(String(256), nullable=True)
#     artists: Mapped[str] = mapped_column(String(256), nullable=True)
#     preview_url: Mapped[str] = mapped_column(String(256), nullable=True)

#     def __repr__(self) -> str:
#         return f"SpotifySong(id={self.id}, name={self.name}, image={self.image}, uri={self.uri}, artists={self.artists}, preview_url={self.preview_url})"

# class SpotifyArtist(Base):
#     __tablename__ = "spotify-artist"
#     id: Mapped[str] = mapped_column(String(64), primary_key=True, nullable=False)
#     name: Mapped[str] = mapped_column(String(256), nullable=False)
#     image: Mapped[str] = mapped_column(String(256), nullable=True)
#     uri: Mapped[str] = mapped_column(String(256), nullable=True)

#     def __repr__(self) -> str:
#         return f"SpotifyArtist(id={self.id}, name={self.name}, image={self.image}, uri={self.uri})"

class SpotifySongData(SortableItemData):
    name: str
    image: str
    artists: str
    preview_url: str

class SpotifyArtistData(SortableItemData):
    name: str
    image: str
