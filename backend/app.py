from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

STUDENTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'students.json')
LESSONS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lessons.json')

def load_students():
  if os.path.exists(STUDENTS_FILE):
    try:
      with open(STUDENTS_FILE, 'r') as file:
        data = json.load(file)
        return data
    except Exception as e:
      print(f"An unexpected error occurred: {e}")
  else:
    print(f"{STUDENTS_FILE} not found.")
  return []

def save_students(data):
  try:
    with open(STUDENTS_FILE, 'w') as file:
      json.dump(data, file, indent=4)
  except Exception as e:
    print(f"An unexpected error occurred while saving data: {e}")

@app.route('/students', methods=['GET'])
def get_students():
  data = load_students()
  return jsonify(data)

@app.route('/students', methods=['POST'])
def add_student():
  new_entry = request.json
  data = load_students()
  data.append(new_entry)
  save_students(data)
  return jsonify(data), 201

@app.route('/students/<int:item_index>', methods=['PUT'])
def update_student(item_index):
  data = load_students()
  if 0 <= item_index < len(data):
    data[item_index] = request.json
    save_students(data)
    return jsonify(data)
  return jsonify({'error': 'Item not found'}), 404

@app.route('/students/<int:item_index>', methods=['DELETE'])
def delete_student(item_index):
  data = load_students()
  if 0 <= item_index < len(data):
    data.pop(item_index)
    save_students(data)
    return jsonify(data)
  return jsonify({'error': 'Item not found'}), 404

#Lessons functionality
def load_lessons():
  if os.path.exists(LESSONS_FILE):
    try:
      with open(LESSONS_FILE, 'r') as file:
        data = json.load(file)
        return data
    except Exception as e:
      print(f"An unexpected error occurred: {e}")
  else:
    print(f"{LESSONS_FILE} not found.")
  return []

def save_lessons(data):
  try:
    with open(LESSONS_FILE, 'w') as file:
      json.dump(data, file, indent=4)
  except Exception as e:
    print(f"An unexpected error occurred while saving data: {e}")

@app.route('/lessons', methods=['GET'])
def get_lessons():
  data = load_lessons()
  return jsonify(data)

@app.route('/lessons', methods=['POST'])
def add_lesson():
  new_entry = request.json
  data = load_lessons()
  data.append(new_entry)
  save_lessons(data)
  return jsonify(data), 201

@app.route('/lessons/<int:item_index>', methods=['PUT'])
def update_lesson(item_index):
  data = load_lessons()
  if 0 <= item_index < len(data):
    data[item_index] = request.json
    save_lessons(data)
    return jsonify(data)
  return jsonify({'error': 'Item not found'}), 404

@app.route('/lessons/<int:item_index>', methods=['DELETE'])
def delete_lesson(item_index):
  data = load_lessons()
  if 0 <= item_index < len(data):
    data.pop(item_index)
    save_lessons(data)
    return jsonify(data)
  return jsonify({'error': 'Item not found'}), 404

if __name__ == '__main__':
  app.run(use_reloader=True, host='127.0.0.1', port=3000)