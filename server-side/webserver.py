from flask import Flask, send_from_directory
from flask_sslify import SSLify

app = Flask(__name__)
ssLify = SSLify(app)

@app.route('/')
@app.route('/home')
def home():
    return send_from_directory('../client-side/html/', 'home.html')

@app.route('/bootstrap/<nome_file>')
def bootstrap(nome_file):
    return send_from_directory('../client-side/bootstrap/', nome_file)

@app.route('/bootstrap/css/<nome_file>')
def bootstrap_css(nome_file):
    return send_from_directory('../client-side/bootstrap/css/', nome_file)

@app.route('/bootstrap/vendor/bootstrap/<cartella>/<nome_file>')
def bootstrap_vendor(cartella, nome_file):
    return send_from_directory('../client-side/bootstrap/vendor/bootstrap/' + cartella + '/', nome_file)

@app.route('/bootstrap/vendor/jquery/<nome_file>')
def jquery(nome_file):
    return send_from_directory('../client-side/bootstrap/vendor/jquery/', nome_file)

if __name__ == '__main__':
    app.run(threaded = True)
