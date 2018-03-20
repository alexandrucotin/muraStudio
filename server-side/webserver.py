# -*- coding: utf-8 -*-

from flask import Flask, g, send_from_directory, request
#from flask_sslify import SSLify
from manager import Manager
from admin import Admin
from json import dumps
from werkzeug.utils import secure_filename
import os


# GLOBAL VARIABLES

app = Flask(__name__)
#ssLify = SSLify(app)
manager = Manager(g, 'database.db')
admin = Admin(manager, 'piper_nigrum', app)


# SESSION OPERARIONS

@app.before_request
def open_connection():
    manager.open_connection()

@app.teardown_request
def close_connection(exception):
    manager.close_connection()


# SENDING FILES

# Landing page
@app.route('/')
def home():
    return send_from_directory('../client-side/html/', 'home.html')

# Any page
@app.route('/<page_name>')
def send_page(page_name):
    return send_from_directory('../client-side/html/', page_name + '.html')

# Bootstrap
@app.route('/bootstrap/<filename>')
def bootstrap(filename):
    return send_from_directory('../client-side/bootstrap/', filename)

@app.route('/bootstrap/css/<filename>')
def bootstrap_css(filename):
    return send_from_directory('../client-side/bootstrap/css/', filename)

@app.route('/bootstrap/vendor/bootstrap/<directory>/<filename>')
def bootstrap_vendor(directory, filename):
    return send_from_directory('../client-side/bootstrap/vendor/bootstrap/' + directory + '/', filename)

# jQuery
@app.route('/bootstrap/vendor/jquery/<filename>')
def jquery(filename):
    return send_from_directory('../client-side/bootstrap/vendor/jquery/', filename)

# Other files
@app.route('/<directory>/<filename>')
def send_file(directory, filename):
    return send_from_directory('../client-side/' + directory + '/', filename)


# CONTEXTS

# User login
@app.route('/user_login', methods = ['POST'])
@app.route('/valid_user', methods = ['POST'])
def user_login():
    client_request = request.get_json(force = True)
    username = client_request['username'].lower()
    password = client_request['password']
    return dumps({'valid_user': admin.valid_user(username, password)})

# Get news
@app.route('/get_news', methods = ['POST'])
def get_news():
    return dumps({'news': admin.get_news()})

# File upload
@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return dumps({'error': 'No file part!'})
    file = request.files['file']
    if file.filename == '':
        return dumps({'error': 'No file selected!'})
    if file and admin.allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join('../client-side/img/', filename))
        return dumps({'success': True})


# STARTING SERVER

if __name__ == '__main__':
    app.run(threaded = True)
