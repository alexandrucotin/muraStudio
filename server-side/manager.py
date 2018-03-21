# -*- coding: utf-8 -*-

from os.path import realpath, dirname, join
from sqlite3 import connect


class Manager:
    
    # Initializing
    def __init__(self, g, db_filename):
        self.g = g
        path = dirname(realpath(__file__))
        self.path = join(path, db_filename)
        self.init_db()
    
    # Creating tables
    def init_db(self):
        database = connect(self.path)
        cursor = database.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                salt TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                description TEXT NOT NULL,
                text TEXT NOT NULL,
                image TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS image (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                value TEXT NOT NULL
            )
        ''')
        database.commit()
        cursor.close()
        database.close()
    
    # Managing connections
    def open_connection(self):
        self.g.db = connect(self.path)
        self.g.db.text_factory = str
    
    def close_connection(self):
        db = getattr(self.g, 'db', None)
        if db is not None:
            db.close()
    
    # Reading methods
    def read_many(self, query, parameters = ()):
        cursor = self.g.db.cursor()
        cursor.execute(query, parameters)
        records = cursor.fetchall()
        cursor.close()
        return records
    
    def read_one(self, query, parameters = ()):
        cursor = self.g.db.cursor()
        cursor.execute(query, parameters)
        records = cursor.fetchone()
        cursor.close()
        return records
    
    def read_field(self, query, parameters = ()):
        return self.read_one(query, parameters)[0]
    
    def read_presence(self, query, parameters = ()):
        return len(self.read_many(query, parameters)) > 0
    
    # Writing methods
    def write(self, query, parameters = ()):
        cursor = self.g.db.cursor()
        cursor.execute(query, parameters)
        self.g.db.commit()
        cursor.close()
