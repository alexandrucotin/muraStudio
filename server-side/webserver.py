# -*- coding: utf-8 -*-

from flask import Flask, g, send_from_directory
# from flask_sslify import SSLify
from manager import Manager


# GLOBAL VARIABLES

app = Flask(__name__)
#ssLify = SSLify(app)
manager = Manager(g)


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


# STARTING SERVER

if __name__ == '__main__':
    app.run(threaded = True)
