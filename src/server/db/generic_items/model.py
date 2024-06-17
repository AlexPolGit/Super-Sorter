from sqlalchemy import String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from db.database import Base

class GenericItem(Base):
    __tablename__ = "generic-item"
    id: Mapped[str] = mapped_column(String(256), primary_key=True, nullable=False)
    owner: Mapped[str] = mapped_column(String(256), nullable=True)
    name: Mapped[str] = mapped_column(String(256), nullable=True)
    image: Mapped[str] = mapped_column(String(256), nullable=True)
    meta: Mapped[str] = mapped_column(JSON, nullable=True)

    def __repr__(self) -> str:
        return f"GenericItem(id={self.id}, owner={self.owner}, name={self.name}, image={self.image}, meta={self.meta})"
