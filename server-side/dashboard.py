# -*- coding: utf-8 -*-

from manager import Manager
from hashlib import sha256
from random import choice


class Dashboard:
    
    # Initializing
    def __init__(self, g, db_filename, pepper):
        self.manager = Manager(g, db_filename)
        self.pepper = pepper
    
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
