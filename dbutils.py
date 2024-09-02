import json
import pymysql
from PIL import Image
from PIL.ExifTags import TAGS
import os
import shutil

host = os.environ.get("AZURE_MYSQL_HOST")
database = os.environ.get("AZURE_MYSQL_NAME")
password = os.environ.get("AZURE_MYSQL_PASSWORD")
user = os.environ.get("AZURE_MYSQL_USER")
uploads = os.environ.get("STORAGE_LOCATION")

production = True

if host is None:
    host = "localhost"
    database = "lemon"
    password = "lemonaid"
    user = "lemon"
    uploads = ""
    production = False

db_config = {
    'host': host,
    'user': user,
    'password': password,
    'database': database,
}

cursor = None
connection = None

try:
    print("connecting to database...")
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()
    with open('dbutils.sql', 'r') as sql_file:
        queries =  sql_file.read().split(';')
        for query in queries:
            print(query)
            if query != '\n':
                cursor.execute(query + ';')

    cursor.execute("SELECT COUNT(*) FROM lemon_admins")
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute("INSERT INTO lemon_admins (password, mail) VALUES ('evan_password', 'evan@evan'), ('udith_password', 'udith@udith'), ('rohit_password', 'rohit@rohit');")

    connection.commit()
except pymysql.Error as e:
    print(f"Error: {e}")

def add_user(username, password, mail_id):
    cursor.execute("SELECT mail FROM lemon_users WHERE mail = %s;", (mail_id))
    existing_mail = cursor.fetchall()
    if len(existing_mail): return False
    cursor.execute("INSERT INTO lemon_users (name, password, mail) VALUES (%s, %s, %s)", (username, password, mail_id))
    shutil.copyfile(uploads + 'static/res/audio1.m4a', uploads + f"static/uploads/users/{mail_id}/audios/audio1.m4a")
    shutil.copyfile(uploads + 'static/res/audio2.m4a', uploads + f"static/uploads/users/{mail_id}/audios/audio2.m4a")
    shutil.copyfile(uploads + 'static/res/audio3.m4a', uploads + f"static/uploads/users/{mail_id}/audios/audio3.m4a")
    cursor.execute("INSERT INTO lemon_user_data (mail, filetype, filename, dimensions, extension, filesize) VALUES (%s, 'audio', 'audio1.m4a', '0x0', NULL, NULL), (%s, 'audio', 'audio2.m4a', '0x0', NULL, NULL), (%s, 'audio', 'audio3.m4a', '0x0', NULL, NULL)", (mail_id, mail_id, mail_id))
    connection.commit()
    return True

def list_files(mail_id, type):
    cursor.execute("SELECT filename FROM lemon_user_data WHERE mail = %s AND filetype = %s;", (mail_id, type))
    file_list = cursor.fetchall()
    files = []
    for file in file_list:
        files.append(file[0])
    return files


def authenticate(mail_id, password):
    cursor.execute("SELECT password FROM lemon_users WHERE mail = %s", (mail_id))
    return_password = cursor.fetchall()
    print(return_password)
    if len(return_password) == 0: return False
    elif return_password[0][0] != password: return False
    else: return True

def authenticate_admin(mail_id, password):
    cursor.execute("SELECT password FROM lemon_admins WHERE mail = %s", (mail_id))
    return_password = cursor.fetchall()
    print(return_password)
    if len(return_password) == 0: return False
    elif return_password[0][0] != password: return False
    else: return True

def users():
    cursor.execute("SELECT name, mail FROM lemon_users")
    connection.commit()
    return cursor.fetchall()

def add_file(mail_id, type, file_name):
    if type == "image":
        image = Image.open(uploads + f"static/uploads/users/{mail_id}/images/{file_name}")
        height, width = image.size
        dimensions = str(height) + "x" + str(width)
        filesize = os.path.getsize(uploads + f"static/uploads/users/{mail_id}/images/{file_name}")
        extension = (os.path.splitext(uploads + f"static/uploads/users/{mail_id}/images/{file_name}"))[1]
    else:
        dimensions = "0x0"
        filesize = 0
        extension = "NULL"
    cursor.execute("INSERT INTO lemon_user_data (mail, filetype, filename, dimensions, extension, filesize) VALUES (%s, %s, %s, %s, %s, %s)", (mail_id, type, file_name, dimensions, extension, filesize))
    # cursor.execute("UPDATE lemon_users SET %s = JSON_ARRAY_APPEND(%s, '$', %s) WHERE mail = %s", (type, type, file_name, mail_id))
    connection.commit()
    return

def check_file(mail_id, type, file_name):
    cursor.execute("SELECT COUNT(*) FROM lemon_user_data WHERE mail = %s AND filetype = %s AND filename = %s;", (mail_id, type, file_name))
    # cursor.execute("UPDATE lemon_users SET %s = JSON_ARRAY_APPEND(%s, '$', %s) WHERE mail = %s", (type, type, file_name, mail_id))
    count = cursor.fetchall()
    print(count)
    return count[0][0]

def delete_file(mail_id, type, file_name):
    cursor.execute("DELETE FROM lemon_user_data WHERE mail = %s AND filetype = %s AND filename = %s", (mail_id, type, file_name))
    connection.commit()
    return

def update_json_image(mail_id, file):
    cursor.execute("UPDATE lemon_users SET images = %s WHERE mail = %s", (file, mail_id)) #type can be image or audio
    connection.commit()
    return

def update_json_audio(mail_id, file):
    cursor.execute("UPDATE lemon_users SET audios = %s WHERE mail = %s", (file, mail_id)) #type can be image or audio
    connection.commit()
    return

def init_timeline(mail_id):
    cursor.execute("SELECT images FROM lemon_users WHERE mail = %s", (mail_id))
    files = cursor.fetchall()
    print(files[0][0])
    if files[0][0] is None:
        return None
    return json.loads(files[0][0])

def search_file(type, filename, mail_id):
    print(filename)
    raw = f"SELECT filename FROM lemon_user_data WHERE filetype = '{type}' AND mail = '{mail_id}' AND filename LIKE '%{filename}%';"
    print(raw)
    cursor.execute(raw)
    results = cursor.fetchall()
    files = []
    for file in results:
        files.append(file[0])
    return files
