export DB_NAME='sorter.db'
echo '.dump'|sqlite3 $DB_NAME|sqlite3 repaired_$DB_NAME
mv $DB_NAME corrupt_$DB_NAME
mv repaired_$DB_NAME $DB_NAME