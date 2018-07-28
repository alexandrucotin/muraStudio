# -*- coding: utf-8 -*-

from hashlib import sha256
from random import choice
from base64 import b64decode
from os import rename, remove
from os.path import realpath, dirname, join


class Admin:

    # Initializing
    def __init__(self, manager, pepper, app):
        self.manager = manager
        self.pepper = pepper
        self.path = dirname(realpath(__file__))
        self.add_admin(app)

    # Adding admin user
    def add_admin(self, app):
        with app.app_context():
            self.manager.open_connection()
            presence = self.manager.read_presence('SELECT * FROM user')
            if not presence:
                salt = self.generate_salt()
                password = sha256(
                        (sha256('admin'.encode('utf-8')).hexdigest() +
                        salt + self.pepper).encode('utf-8')
                    ).hexdigest()
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
            SELECT w.id, w.title, w.date, c.interiors, c.architecture,
                   c.retail, c.commercial, i.location
            FROM work w
            INNER JOIN category c
            ON (w.id = c.work_id)
            INNER JOIN image i
            ON (w.preview_id = i.id)
            ORDER BY w.id DESC
        ''')
    
    # Get work element
    def get_work_element(self, element_id):
        return self.manager.read_one('''
            SELECT w.title, w.date, w.text, i.location
            FROM work w
            INNER JOIN image i
            ON (w.preview_id = i.id)
            WHERE w.id = ?
        ''', (element_id,))
    
    # Get landpage images
    def get_landpage_images(self):
        return self.manager.read_many('''
            SELECT i.id, i.location
            FROM landpage l
            INNER JOIN image i
            ON (l.image_id = i.id)
            ORDER BY i.id DESC
        ''')
    
    # Add landpage image
    def add_landpage_image(self, image):
        image_id = self.upload_image(image)
        self.manager.write('''
            INSERT INTO landpage (image_id)
            VALUES (?)
        ''', (image_id,))
    
    # Delete landpage image
    def delete_landpage_image(self, image_id):
        self.delete_image(image_id)
        self.manager.write('''
            DELETE FROM landpage
            WHERE image_id = ?
        ''', (image_id,))
    
    # Post work
    def post_work(self, title, text, image, interiors, architecture, retail, commercial):
        preview_id = self.upload_image(image)
        cursor = self.manager.g.db.cursor()
        cursor.execute('''
            INSERT INTO work (title, text, preview_id)
            VALUES (?, ?, ?)
        ''', (title, text, preview_id))
        work_id = cursor.lastrowid
        cursor.execute('''
            INSERT INTO category (work_id, interiors, architecture, retail, commercial)
            VALUES (?, ?, ?, ?, ?)
        ''', (work_id, interiors, architecture, retail, commercial))
        self.manager.g.db.commit()
        cursor.close()
        return work_id
    
    # Get work images
    def get_work_images(self, work_id):
        return self.manager.read_many('''
            SELECT i.id, i.location
            FROM work_image wi
            INNER JOIN image i
            ON (wi.image_id = i.id)
            WHERE wi.work_id = ?
            ORDER BY i.id DESC
        ''', (work_id,))
    
    # Add work image
    def add_work_image(self, image, work_id):
        image_id = self.upload_image(image)
        self.manager.write('''
            INSERT INTO work_image (image_id, work_id)
            VALUES (?, ?)
        ''', (image_id, work_id))
    
    # Delete work image
    def delete_work_image(self, image_id):
        self.delete_image(image_id)
        self.manager.write('''
            DELETE FROM work_image
            WHERE image_id = ?
        ''', (image_id,))
    
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
        self.write_and_move(image, image_name, image_location)
        cursor.execute('''
            UPDATE image
            SET location = ?
            WHERE id = ?
        ''', (image_location, image_id))
        self.manager.g.db.commit()
        cursor.close()
        return image_id
    
    # Writes and moves image
    def write_and_move(self, image, image_name, image_location):
        image_data = b64decode(image.split(',')[1])
        image_path = join(self.path, image_name)
        f = open(image_path, 'wb')
        f.write(image_data)
        f.close()
        upload_path = join(self.path, '../client-side' + image_location)
        rename(image_path, upload_path)
    
    # Image deleting
    def delete_image(self, image_id):
        location = self.manager.read_field('''
            SELECT location
            FROM image
            WHERE id = ?
        ''', (image_id,))
        self.manager.write('''
            DELETE FROM image
            WHERE id = ?
        ''', (image_id,))
        remove(join(self.path, '../client-side' + location))
    
    # Get work list
    def get_work_list(self):
        return self.manager.read_many('''
            SELECT id, title, date
            FROM work
            ORDER BY id DESC
        ''')
    
    # Modify work element
    def modify_work_element(self, element_id, title, text):
        self.manager.write('''
            UPDATE work
            SET title = ?, text = ?
            WHERE id = ?
        ''', (title, text, element_id))
    
    # Delete work element
    def delete_work_post(self, element_id):
        preview_id = self.manager.read_field('''
            SELECT preview_id
            FROM work
            WHERE id = ?
        ''', (element_id,))
        self.delete_image(preview_id)
        self.manager.write('''
            DELETE FROM work
            WHERE id = ?
        ''', (element_id,))
        self.manager.write('''
            DELETE FROM category
            WHERE work_id = ?
        ''', (element_id,))
        for image_id in self.manager.read_many('''
            SELECT image_id
            FROM work_image
            WHERE work_id = ?
        ''', (element_id,)):
            self.delete_image(image_id)
        self.manager.write('''
            DELETE FROM work_image
            WHERE work_id = ?
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
