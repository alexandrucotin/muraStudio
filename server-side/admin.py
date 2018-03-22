# -*- coding: utf-8 -*-

from hashlib import sha256
from random import choice
from base64 import b64decode
from os import rename
from os.path import realpath, dirname, join


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
    
    # Get work
    def get_work(self):
        return self.manager.read_many('''
            SELECT id, title, date, description, text, image
            FROM work
            ORDER BY id DESC
        ''')
    
    # Get work element
    def get_work_element(self, element_id):
        return self.manager.read_one('''
            SELECT title, date, description, text, image
            FROM work
            WHERE id = ?
        ''', (element_id,))
    
    # Post work
    def post_work(self, title, description, text, image):
        image_location = self.upload_image(image)
        self.manager.write('''
            INSERT INTO work (title, description, text, image)
            VALUES (?, ?, ?, ?)
        ''', (title, description, text, image_location))
    
    # Image uploading
    def upload_image(self, image):
        cursor = self.manager.g.db.cursor()
        cursor.execute('''
            INSERT INTO image (location)
            VALUES (?)
        ''', ('',))
        image_id = cursor.lastrowid
        image_type = image.split('/')[1].split(';')[0]
        image_name = 'image_' + str(image_id) + '.' + image_type
        image_location = '/img/uploads/' + image_name
        image_data = b64decode(image.split(',')[1])
        path = dirname(realpath(__file__))
        f = open(join(path, image_name), 'wb')
        f.write(image_data)
        f.close()
        rename(join(path, image_name), join(path, '../client-side' + image_location))
        cursor.execute('''
            UPDATE image
            SET location = ?
            WHERE id = ?
        ''', (image_location, image_id))
        self.manager.g.db.commit()
        cursor.close()
        return image_location
    
    # Get work list
    def get_work_list(self):
        return self.manager.read_many('''
            SELECT id, title, date
            FROM work
            ORDER BY id DESC
        ''')
    
    # Modify work element
    def modify_work_element(self, element_id, title, description, text):
        self.manager.write('''
            UPDATE work
            SET title = ?, description = ?, text = ?
            WHERE id = ?
        ''', (title, description, text, element_id))
    
    # Delete work element
    def delete_work_post(self, element_id):
        self.manager.write('''
            DELETE FROM work
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
