from db.database import DataBase

class DbGenericItemObject:
    def __init__(self, id: str, name: str, image: str, metadata: str) -> None:
        self.id = id
        self.name = name
        self.image = image
        self.metadata = metadata

class GenericItemDataBase(DataBase):

    def getItems(self, ids: list[str], username: str) -> list[DbGenericItemObject]:
        if (len(ids) == 0):
            return []

        print(ids)
        idQuery = ""
        for i, id in enumerate(ids):
            idQuery += f"id = '{id}'"
            if (i < len(ids) - 1):
                idQuery += " OR "
        
        query = f"SELECT id, name, image, metadata FROM 'generic-items' WHERE owner = '{username}' AND ({idQuery})"
        res = self.fetchAll(query)
        items: list[DbGenericItemObject] = []
        for item in res:
            id, name, image, metadata = item[0], item[1], item[2], item[3]
            items.append(DbGenericItemObject(id, name, image, metadata))
        return items
    
    def addItems(self, items: list[dict], username: str) -> list[str]:
        if (len(items) == 0):
            return []

        valuesString = ""
        ids: list[str] = []
        for i, item in enumerate(items):
            self.sanitizeDbInput(item)
            ids.append(f"{username}-{item['image']}")
            valuesString += f"('{username}', '{item['name']}', '{item['image']}', '{item['metadata']}')"
            if (i < len(items) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'generic-items' (owner, name, image, metadata) VALUES {valuesString}"
        self.execute(query)
        return ids
