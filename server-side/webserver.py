# -*- coding: utf-8 -*-

from flask import Flask, g, send_from_directory, request
from flask_sslify import SSLify
from manager import Manager
from admin import Admin
from json import dumps


# GLOBAL VARIABLES

app = Flask(__name__)
ssLify = SSLify(app)
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
def send_files(directory, filename):
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

# Get news element
@app.route('/get_news_element', methods = ['POST'])
def get_news_element():
    client_request = request.get_json(force = True)
    element_id = client_request['id']
    return dumps({'news_post': admin.get_news_element(element_id)})

# Post news
@app.route('/post_news', methods = ['POST'])
def post_news():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    title = client_request['title']
    description = client_request['description']
    text = client_request['text']
    image = client_request['image']
    admin.post_news(title, description, text, image)
    return dumps({'success': True})

# Get news list
@app.route('/get_news_list', methods = ['POST'])
def get_news_list():
    return dumps({'news': admin.get_news_list()})

# Modify news element
@app.route('/modify_news_element', methods = ['POST'])
def modify_news_element():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    element_id = client_request['id']
    title = client_request['title']
    description = client_request['description']
    text = client_request['text']
    admin.modify_news_element(element_id, title, description, text)
    return dumps({'success': True})

# Delete news element
@app.route('/delete_news_post', methods = ['POST'])
def delete_news_post():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    element_id = client_request['id']
    return dumps({'news_post': admin.delete_news_post(element_id)})

# Change password
@app.route('/change_password', methods = ['POST'])
def change_password():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    new_password = client_request['new_password']
    admin.change_password(username, new_password)
    return dumps({'success': True})


# STARTING SERVER

if __name__ == '__main__':
    app.run(threaded = True)
