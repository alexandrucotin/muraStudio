# -*- coding: utf-8 -*-

from hashlib import sha256
from random import choice


class Admin:
    
    # Initializing
    def __init__(self, manager, pepper, app):
        self.manager = manager
        self.pepper = pepper
        self.add_admin(app)
    
    # Adding admin user
    def add_admin(self, app):
        with app.app_context():
            self.manager.open_connection()
            presence = self.manager.read_presence('SELECT * FROM user')
            if not presence:
                salt = self.generate_salt()
                password = sha256(sha256('admin').hexdigest() + salt + self.pepper).hexdigest()
                self.manager.write('''
                    INSERT INTO user (username, password, salt)
                    VALUES (?, ?, ?)
                ''', ('admin', password, salt))
            self.manager.close_connection()
    
    # User login
    def valid_user(self, username, password):
        valid = False
        result = self.manager.read_one('''
            SELECT password, salt
            FROM user
            WHERE username = ?
        ''', (username,))
        if result:
            password_hash = result[0]
            salt = result[1]
            valid = password_hash == sha256(password + salt + self.pepper).hexdigest()
        return valid
    
    # Salt generating
    def generate_salt(self):
        alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        salt = ''
        for i in range(16):
            salt += choice(alphabet)
        return salt
    
    # Get news
    def get_news(self):
        return self.manager.read_many('''
            SELECT id, title, date, description, text, image
            FROM news
            ORDER BY id DESC
        ''')
    
    # Get news
    def get_news_element(self, element_id):
        return self.manager.read_one('''
            SELECT title, date, description, text, image
            FROM news
            WHERE id = ?
        ''', (element_id,))
    
    # Post news
    def post_news(self, title, description, text, image):
        self.manager.write('''
            INSERT INTO news (title, description, text, image)
            VALUES (?, ?, ?, ?)
        ''', (title, description, text, image))
    
    # Get news list
    def get_news_list(self):
        return self.manager.read_many('''
            SELECT id, title, date
            FROM news
            ORDER BY id DESC
        ''')
    
    # Delete news element
    def delete_news_post(self, element_id):
        self.manager.write('''
            DELETE FROM news
            WHERE id = ?
        ''', (element_id,))
    
    # Change password
    def change_password(self, username, password):
        salt = self.generate_salt()
        password = sha256(password + salt + self.pepper).hexdigest()
        self.manager.write('''
            UPDATE user
            SET password = ?, salt = ?
            WHERE username = ?
        ''', (password, salt, username))
