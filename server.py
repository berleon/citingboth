
from flask import Flask, send_from_directory
import flask
app = Flask(__name__)

@app.route('/<path:filename>')
def home(filename):
    resp = send_from_directory('.', filename)
    #‘Access-Control-Allow-Origin
    #resp.headers['Access-Control-Allow-Origin'] =  'https://api.semanticscholar.org'
    resp.headers['Access-Control-Allow-Origin'] =  '*'
    resp.headers['Vary'] =  'Origin'
    # resp.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS'
    # resp.headers['Access-Control-Max-Age'] = 1000
    # resp.headers['Access-Control-Allow-Headers'] =  'Content-Type, Authorization, X-Requested-With';
    return resp