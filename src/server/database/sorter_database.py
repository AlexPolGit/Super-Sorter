from sqlalchemy import Engine, create_engine, insert, select, update, delete
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
from util.env_vars import getEnvironmentVariable

class Base(DeclarativeBase):
    def getMap(self) -> dict:
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class SorterDataBase:
    engine: Engine

    def __init__(self) -> None:
        self.engine = create_engine(f"sqlite:///{getEnvironmentVariable("DATABASE_FILE_PATH")}")
        Base.metadata.create_all(self.engine)

    def _selectAll(self, tableToSelectFrom: Base, condition = None) -> list[Base]:
        with sessionmaker(bind = self.engine)() as session:
            selectQuery = (
                select(tableToSelectFrom).
                where(condition)
            )
            result = session.scalars(selectQuery).all()
            session.close()
            return result

    def _selectOne(self, tableToSelectFrom: Base, condition = None) -> Base:
        with sessionmaker(bind = self.engine)() as session:
            selectQuery = (
                select(tableToSelectFrom).
                where(condition)
            )
            result = session.scalars(selectQuery).one_or_none()
            session.close()
            return result
        
    def _selectMultiple(self, tableToSelectFrom: Base, propertyFilter = None) -> Base:
        with sessionmaker(bind = self.engine)() as session:
            selectQuery = ( 
                select(tableToSelectFrom)
                .where(propertyFilter)
            )
            result = session.scalars(selectQuery).all()
            session.close()
            return result

    def _insertOne(self, tableToInsertInto: Base, valuesToInsert, valueToReturn) -> Base:
        with sessionmaker(bind = self.engine)() as session:
            insertQuery = (
                insert(tableToInsertInto).
                values(valuesToInsert).
                returning(valueToReturn)
            )
            newItem = session.scalars(insertQuery).one()
            session.commit()
            session.close()
            return newItem
        
    def _insertMultiple(self, valuesToInsert: list[Base]):
        with sessionmaker(bind = self.engine)() as session:
            for value in valuesToInsert:
                session.merge(value)
            session.commit()
            session.close()

    def _updateOne(self, tableToUpdate: Base, condition, valuesToUpdate) -> Base:
        with sessionmaker(bind = self.engine)() as session:
            updateQuery = (
                update(tableToUpdate).
                where(condition).
                values(valuesToUpdate)
            )
            session.execute(updateQuery)
            session.commit()
            session.close()

    def _deleteOne(self, tableToDeleteFrom: Base, condition, valuesToReturn):
        with sessionmaker(bind = self.engine)() as session:
            deleteQuery = (
                delete(tableToDeleteFrom).
                where(condition).
                returning(valuesToReturn)
            )
            session.scalars(deleteQuery).one()
            session.commit()
            session.close()
