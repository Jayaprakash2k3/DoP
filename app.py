from flask import Flask,request,jsonify
from flask_cors import CORS
import dac 
app = Flask(__name__)
CORS(app,origins=['*'])
@app.route("/")
def hello_world():
    param1 = float(request.args.get('lat'))
    param2 = float(request.args.get('lng'))
    return {"dac":dac.encode(param1, param2)}