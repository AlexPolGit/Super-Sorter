from objects.sorts.merge import MergeSorter
from objects.sorts.queue_merge import QueueMergeSorter
from objects.sorts.sorter import Comparison, ComparisonRequest
from objects.sortable_item import SortableItem

f = open("sort_testing_data.txt", "r")
fileContents = f.read()
f.close()
items = fileContents.split("\n")
itemList = []
for i in items:
    itemList.append(SortableItem(i))
print(itemList)

SORTER = QueueMergeSorter([], [], 123)

def fakeCompare(comparisonRequest: ComparisonRequest) -> Comparison:
    choice = comparisonRequest.itemA if int(comparisonRequest.itemA.getIdentifier()) > int(comparisonRequest.itemB.getIdentifier()) else comparisonRequest.itemB
    return Comparison(comparisonRequest.itemA, comparisonRequest.itemB, choice)

fakeChoice = None
turn = 1

print(f"Estimated total comparisons: {SORTER.getTotalEstimate(itemList)}")

while(True):
    print(f"[{turn}]")
    turn += 1
    output = SORTER.doSort(itemList, fakeChoice)
    if (isinstance(output, list)):
        print("------------")
        print(output)
        break
    else:
        fakeChoice = fakeCompare(output)
        print(fakeChoice.itemA, fakeChoice.itemB, fakeChoice.choice)
        # print("---")
