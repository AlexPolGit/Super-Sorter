from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from db.database import Base

class AnilistCharacter(Base):
    __tablename__ = "anilist-character"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    name_full: Mapped[str] = mapped_column(String(256), nullable=False)
    name_native: Mapped[str] = mapped_column(String(256), nullable=True)
    image: Mapped[str] = mapped_column(String(256), nullable=True)
    gender: Mapped[str] = mapped_column(String(64), nullable=True)
    age: Mapped[str] = mapped_column(String(64), nullable=True)
    favourites: Mapped[int] = mapped_column(Integer, nullable=True)

    def __repr__(self) -> str:
        return f"AnilistCharacter(id={self.id}, name_full={self.name_full}, name_native={self.name_native}, image={self.image}, gender={self.gender}, age={self.age}, favourites={self.favourites})"

class AnilistStaff(Base):
    __tablename__ = "anilist-staff"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    name_full: Mapped[str] = mapped_column(String(256), nullable=False)
    name_native: Mapped[str] = mapped_column(String(256), nullable=True)
    image: Mapped[str] = mapped_column(String(256), nullable=True)
    gender: Mapped[str] = mapped_column(String(64), nullable=True)
    age: Mapped[str] = mapped_column(String(64), nullable=True)
    favourites: Mapped[int] = mapped_column(Integer, nullable=True)

    def __repr__(self) -> str:
        return f"AnilistStaff(id={self.id}, name_full={self.name_full}, name_native={self.name_native}, image={self.image}, gender={self.gender}, age={self.age}, favourites={self.favourites})"

class AnilistMedia(Base):
    __tablename__ = "anilist-media"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    image: Mapped[str] = mapped_column(String(256), nullable=True)
    title_romaji: Mapped[str] = mapped_column(String(256), nullable=False)
    title_english: Mapped[str] = mapped_column(String(256), nullable=True)
    title_native: Mapped[str] = mapped_column(String(256), nullable=True)
    favourites: Mapped[int] = mapped_column(Integer, nullable=True)
    mean_score: Mapped[int] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(32), nullable=True)
    format: Mapped[str] = mapped_column(String(32), nullable=True)
    genres: Mapped[str] = mapped_column(String(256), nullable=True)

    def __repr__(self) -> str:
        return f"AnilistMedia(id={self.id}, image={self.image}, title_romaji={self.title_romaji}, title_english={self.title_english}, title_native={self.title_native}, favourites={self.favourites}, mean_score={self.mean_score}, status={self.status}, format={self.format}, genres={self.genres})"
