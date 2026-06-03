import psycopg2

conn = psycopg2.connect('postgresql://postgres:admin@localhost:5432/grocery_db')
cursor = conn.cursor()
cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'products' ORDER BY column_name")
print("Existing columns in products table:")
for row in cursor.fetchall():
    print(f"  - {row[0]}")
conn.close()
