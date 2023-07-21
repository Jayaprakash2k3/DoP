from flask import Flask,request,jsonify
from flask_cors import CORS
import dac 
from pymongo import MongoClient
from bson.json_util import dumps, loads
app = Flask(__name__)
CORS(app,origins=['*'])
@app.route("/")
def hello_world(request):
    param1 = float(request.args.get('lat'))
    param2 = float(request.args.get('lng'))
    return {"dac":dac.encode(param1, param2)}


client = MongoClient('mongodb://localhost:27017/')
db = client['DAC']
@app.route('/DAC')
def DAC():
    try:
        users_collection = db['Polygon']
        polygons = list(users_collection.find())
        return dumps(polygons)
        # return "Hello World"

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
