from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from db.database import Base

class User(Base):
  __tablename__ = "user"
  username: Mapped[str] = mapped_column(String(256), primary_key=True, nullable=False)
  password: Mapped[str] = mapped_column(String(256), nullable=False)
  admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
  google: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
  
  def __repr__(self) -> str:
    return f"User(username={self.username}, password={self.password}, admin={self.admin}, google={self.google})"
