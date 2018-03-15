from flask import Flask, send_from_directory
from flask_sslify import SSLify

app = Flask(__name__)
ssLify = SSLify(app)

@app.route('/')
@app.route('/home')
def home():
    return send_from_directory('../client-side/html/', 'home.html')

if __name__ == '__main__':
    app.run(threaded = True)
