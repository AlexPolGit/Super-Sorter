from sqlalchemy import Engine, create_engine, insert, select, update, delete
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
from util.env_vars import getEnvironmentVariable

class Base(DeclarativeBase):
    def getJson(self) -> dict:
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class SorterDataBase:
    engine: Engine

    def __init__(self) -> None:
        self.engine = create_engine(f"sqlite:///{getEnvironmentVariable("DATABASE_FILE_PATH")}", echo = True) # 
        Base.metadata.create_all(self.engine)

    def _selectAll(self, tableToSelectFrom: Base, condition = None) -> list[Base]:
        with sessionmaker(bind = self.engine)() as session:
            if (not condition == None):
                selectQuery = (
                    select(tableToSelectFrom).
                    where(condition)
                )
            else:
                selectQuery = (
                    select(tableToSelectFrom)
                )
            result = session.execute(selectQuery).fetchall()
            session.close()
            return result

    def _selectOne(self, tableToSelectFrom: Base, condition) -> Base:
        with sessionmaker(bind = self.engine)() as session:
            selectQuery = (
                select(tableToSelectFrom).
                where(condition)
            )
            result = session.execute(selectQuery).fetchone()
            session.close()
            return result
        
    def _selectMultiple(self, tableToSelectFrom: Base, propertyFilter) -> Base:
        with sessionmaker(bind = self.engine)() as session:
            selectQuery = ( 
                select(tableToSelectFrom)
                .where(propertyFilter)
            )
            result = session.execute(selectQuery).fetchall()
            session.close()
            return result

    def _insertOne(self, tableToInsertInto: Base, valuesToInsert, valueToReturn) -> Base:
        with sessionmaker(bind = self.engine)() as session:
            insertQuery = (
                insert(tableToInsertInto).
                values(valuesToInsert).
                returning(valueToReturn)
            )
            newItem = session.execute(insertQuery).fetchone()
            session.commit()
            session.close()
            return newItem
        
    # def _insertMultiple(self, tableToInsertInto: Base, valuesToInsert, valueToReturn) -> Base:
    #     with sessionmaker(bind = self.engine)() as session:
    #         session.add_all()
    #         insertQuery = (
    #             insert(tableToInsertInto).
    #             values(valuesToInsert).
    #             returning(valueToReturn)
    #         )
    #         newItems = session.execute(insertQuery).fetchall()
    #         session.commit()
    #         session.close()
    #         return newItems
        
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
            session.execute(deleteQuery).fetchone()
            session.commit()
            session.close()
