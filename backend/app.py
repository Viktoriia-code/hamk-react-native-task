from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data.json')

def load_data():
  if os.path.exists(DATA_FILE):
    try:
      with open(DATA_FILE, 'r') as file:
        data = json.load(file)
        return data
    except Exception as e:
      print(f"An unexpected error occurred: {e}")
  else:
    print(f"{DATA_FILE} not found.")
  return []

def save_data(data):
  try:
    with open(DATA_FILE, 'w') as file:
      json.dump(data, file, indent=4)
  except Exception as e:
    print(f"An unexpected error occurred while saving data: {e}")

@app.route('/data', methods=['GET'])
def get_data():
  data = load_data()
  return jsonify(data)

@app.route('/data', methods=['POST'])
def add_data():
  new_entry = request.json
  data = load_data()
  data.append(new_entry)
  save_data(data)
  return jsonify(data), 201

@app.route('/data/<int:item_index>', methods=['PUT'])
def update_data(item_index):
  data = load_data()
  if 0 <= item_index < len(data):
    data[item_index] = request.json
    save_data(data)
    return jsonify(data)
  return jsonify({'error': 'Item not found'}), 404

@app.route('/data/<int:item_index>', methods=['DELETE'])
def delete_data(item_index):
  data = load_data()
  if 0 <= item_index < len(data):
    data.pop(item_index)
    save_data(data)
    return jsonify(data)
  return jsonify({'error': 'Item not found'}), 404

if __name__ == '__main__':
  app.run(use_reloader=True, host='127.0.0.1', port=3000)