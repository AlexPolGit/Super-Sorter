from database.sortables import SortableItemDataBase
from domain.objects.models.sortable import SortableItemType

db = SortableItemDataBase()

items = [
    {
        "id": 1,
        "data": {
            "name_full": "Name 1",
            "name_native": "名前1",
            "image": "image1.png"
        }
    },
    {
        "id": 2,
        "data": {
            "name_full": "Name 2",
            "name_native": "名前2",
            "image": "image2.png"
        }
    },
    {
        "id": 3,
        "data": {
            "name_full": "Name 3",
            "name_native": "名前3",
            "image": "image3.png"
        }
    }
]

# db.addItems(items, SortableItemType.ANILIST_CHARACTER)
itemList = db.getItems([1, 2, 3], SortableItemType.ANILIST_CHARACTER)
for i in itemList:
    print(i)
