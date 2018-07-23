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
@app.route('/meetus2')
def template_test():
    return render_template('/templates/meetus2.html')

# Not found
@app.errorhandler(404)
def not_found(e):
    return send_from_directory('../client-side/html/', '404.html')

# Landing page
@app.route('/')
def home():
    return send_from_directory('../client-side/html/', 'home.html')

# Any page
@app.route('/<page_name>')
def send_page(page_name):
    return send_from_directory('../client-side/html/', page_name + '.html')

# Images
@app.route('/img/uploads/<image>')
def send_image(image):
    return send_from_directory('../client-side/img/uploads/', image)



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

# Get work
@app.route('/get_work', methods = ['POST'])
def get_work():
    return dumps({'work': admin.get_work()})

# Get work element
@app.route('/get_work_element', methods = ['POST'])
def get_work_element():
    client_request = request.get_json(force = True)
    element_id = client_request['id']
    return dumps({'work_element': admin.get_work_element(element_id)})

# Get landpage images
@app.route('/get_landpage_images', methods = ['POST'])
def get_landpage_images():
    return dumps({'images': admin.get_landpage_images()})

# Add landpage image
@app.route('/add_landpage_image', methods = ['POST'])
def add_landpage_image():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    image = client_request['image']
    admin.add_landpage_image(image)
    return dumps({'success': True})

# Delete landpage image
@app.route('/delete_landpage_image', methods = ['POST'])
def delete_landpage_image():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    image_id = client_request['image_id']
    admin.delete_landpage_image(image_id)
    return dumps({'success': True})

# Post work
@app.route('/post_work', methods = ['POST'])
def post_work():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    title = client_request['title']
    text = client_request['text']
    image = client_request['image']
    interiors = client_request['interiors']
    architecture = client_request['architecture']
    retail = client_request['retail']
    commercial = client_request['commercial']
    work_id = admin.post_work(title, text, image, interiors, architecture, retail, commercial)
    return dumps({'work_id': work_id})

# Get work images
@app.route('/get_work_images', methods = ['POST'])
def get_work_images():
    client_request = request.get_json(force = True)
    work_id = client_request['work_id']
    return dumps({'images': admin.get_work_images(work_id)})

# Add work image
@app.route('/add_work_image', methods = ['POST'])
def add_work_image():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    image = client_request['image']
    work_id = client_request['work_id']
    admin.add_work_image(image, work_id)
    return dumps({'success': True})

# Delete work image
@app.route('/delete_work_image', methods = ['POST'])
def delete_work_image():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    image_id = client_request['image_id']
    admin.delete_work_image(image_id)
    return dumps({'success': True})

# Get work list
@app.route('/get_work_list', methods = ['POST'])
def get_work_list():
    return dumps({'work': admin.get_work_list()})

# Modify work element
@app.route('/modify_work_element', methods = ['POST'])
def modify_work_element():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    element_id = client_request['id']
    title = client_request['title']
    text = client_request['text']
    admin.modify_work_element(element_id, title, text)
    return dumps({'success': True})

# Delete work element
@app.route('/delete_work_post', methods = ['POST'])
def delete_work_post():
    client_request = request.get_json(force = True)
    username = client_request['username']
    password = client_request['password']
    if not admin.valid_user(username, password):
        return dumps({'user_not_valid': True})
    element_id = client_request['id']
    admin.delete_work_post(element_id)
    return dumps({'success': True})

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
