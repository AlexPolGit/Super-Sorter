class SortableItem:
    id: str

    def __init__(self, id: str) -> None:
        self.id = id

    def __str__(self):
        return f"{self.id}"

    def __repr__(self):
        return f"{self.id}"

    def json(self) -> str:
        return f"\"{self.id}\""
    
    def getIdentifier(self) -> str:
        return self.id
