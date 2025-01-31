from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    db_path = r'C:\Users\Gonzalo Bondar\Desktop\Ana Surak\sistema_ventas.db'
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # Permite acceder a las columnas por nombre
        print("Conexión exitosa a la base de datos")
        return conn
    except sqlite3.Error as e:
        print("Error al conectar a la base de datos:", e)
        return None

@app.route('/api/insumos', methods=['GET'])
def get_insumos():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT nombre, cantidad, unidad_medida, precio_unitario FROM insumos")
        insumos = cursor.fetchall()
        conn.close()
        print("Datos obtenidos de la base de datos:", insumos)

        # Convertir a diccionario para una mejor compatibilidad con JSON
        insumos_dict = [dict(row) for row in insumos]
        return jsonify(insumos_dict)
    except sqlite3.Error as e:
        print("Error en la consulta a la base de datos:", e)
        return jsonify({"error": "Error al obtener los datos de la base de datos"}), 500

@app.route('/api/insumos', methods=['POST'])
def agregar_insumo():
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO insumos (nombre, unidad_medida, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?)
        """, (data['nombre'], data['unidad_medida'], data['cantidad'], data['precio_unitario']))
        conn.commit()
        conn.close()
        return jsonify({"message": "Insumo agregado correctamente"}), 201
    except sqlite3.Error as e:
        print("Error al agregar insumo:", e)
        return jsonify({"error": "Error al agregar insumo"}), 500

@app.route('/api/insumos', methods=['DELETE'])
def eliminar_insumo():
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM insumos WHERE nombre = ?", (data['nombre'],))
        conn.commit()
        conn.close()
        return jsonify({"message": "Insumo eliminado correctamente"}), 200
    except sqlite3.Error as e:
        print("Error al eliminar insumo:", e)
        return jsonify({"error": "Error al eliminar insumo"}), 500

@app.route('/api/insumos', methods=['PUT'])
def modificar_insumo():
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE insumos
            SET unidad_medida = ?, cantidad = ?, precio_unitario = ?
            WHERE nombre = ?
        """, (data['unidad_medida'], data['cantidad'], data['precio_unitario'], data['nombre']))
        conn.commit()
        conn.close()
        return jsonify({"message": "Insumo modificado correctamente"}), 200
    except sqlite3.Error as e:
        print("Error al modificar insumo:", e)
        return jsonify({"error": "Error al modificar insumo"}), 500

if __name__ == '__main__':
    app.run(debug=True)
