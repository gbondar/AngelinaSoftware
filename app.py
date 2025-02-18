from flask import Flask, request, jsonify
import sqlite3
import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#Conecta la BBDD por primera vez
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

#Lee insumos
@app.route('/api/insumos', methods=['GET'])
def get_insumos():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id,nombre, cantidad, unidad_medida, precio_unitario FROM insumos")
        insumos = cursor.fetchall()
        conn.close()
        print("Datos obtenidos de la base de datos:", insumos)

        # Convertir a diccionario para una mejor compatibilidad con JSON
        insumos_dict = [dict(row) for row in insumos]
        return jsonify(insumos_dict)
    except sqlite3.Error as e:
        print("Error en la consulta a la base de datos:", e)
        return jsonify({"error": "Error al obtener los datos de la base de datos"}), 500


#Agrega en tabla insumos
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

#Elimina de tabla insumos
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

#Modifica insumos
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
    
# Leer recetas
@app.route('/api/recetas', methods=['GET'])
def get_recetas():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, nombre, precio_venta FROM recetas")
        recetas = cursor.fetchall()
        conn.close()
        return jsonify([dict(row) for row in recetas])
    except sqlite3.Error as e:
        return jsonify({"error": "Error al obtener recetas"}), 500


#fetch de insumo-recetas
    
@app.route('/api/receta_insumos/<int:receta_id>', methods=['GET'])
def get_receta_insumos(receta_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT i.nombre AS insumo, ri.cantidad, i.unidad_medida
            FROM receta_insumos ri
            JOIN insumos i ON ri.insumo_id = i.id
            WHERE ri.receta_id = ?
        """, (receta_id,))
        
        insumos = cursor.fetchall()
        conn.close()

        if not insumos:
            return jsonify([])  # Si la receta no tiene insumos, devolvemos una lista vacía

        return jsonify([dict(row) for row in insumos])  # Convertimos a JSON

    except sqlite3.Error as e:
        return jsonify({"error": "Error al obtener los insumos de la receta"}), 500
    
#Delete de insumo-receta
@app.route('/api/receta_insumos/<int:receta_id>/<int:insumo_id>', methods=['DELETE'])
def eliminar_receta_insumo(receta_id, insumo_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM receta_insumos WHERE receta_id = ? AND insumo_id = ?", (receta_id, insumo_id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Insumo eliminado correctamente"}), 200

    except sqlite3.Error as e:
        return jsonify({"error": "Error al eliminar el insumo"}), 500


    
#Agregar insumo-receta
# Conversión de unidades (kg ↔ g, lt ↔ ml)
def convertir_unidad(cantidad, unidad_origen, unidad_destino):
    conversiones = {
        ("Kg", "Gr"): 1000,
        ("Gr", "Kg"): 0.001,
        ("Lt", "Ml"): 1000,
        ("Ml", "Lt"): 0.001,
        ("Unidades", "Unidades"): 1  # No cambia
    }

    if (unidad_origen, unidad_destino) in conversiones:
        return cantidad * conversiones[(unidad_origen, unidad_destino)]
    else:
        return None  # Conversión no válida

@app.route('/api/receta_insumos/<int:receta_id>', methods=['PUT'])
def actualizar_receta_insumos(receta_id):
    data = request.json  # Recibir lista de insumos desde el frontend

    print("🔹 Receta ID recibido:", receta_id)
    print("🔹 Datos recibidos:", data)

    if not isinstance(data, list):  # Validar que sea una lista
        return jsonify({"error": "Los datos deben ser una lista de insumos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        for insumo in data:
            insumo_id = insumo.get("insumo_id")
            cantidad = insumo.get("cantidad")
            unidad_medida = insumo.get("unidad_medida")

            if not all([insumo_id, cantidad, unidad_medida]):
                continue  # Si falta algún dato, omitir

            print(f"Procesando insumo: ID={insumo_id}, Cantidad={cantidad}, Unidad={unidad_medida}")

            # Obtener la unidad base desde la base de datos
            cursor.execute("SELECT unidad_medida FROM insumos WHERE id = ?", (insumo_id,))
            resultado = cursor.fetchone()
            if not resultado:
                print(f"❌ Insumo {insumo_id} no encontrado en la base de datos.")
                continue  # Insumo no encontrado

            unidad_base = resultado["unidad_medida"]

            # Convertir cantidad si la unidad ingresada es diferente a la base
            if unidad_medida != unidad_base:
                cantidad_convertida = convertir_unidad(cantidad, unidad_medida, unidad_base)
                if cantidad_convertida is None:
                    print(f"❌ No se pudo convertir {unidad_medida} a {unidad_base}")
                    return jsonify({"error": f"No se puede convertir {unidad_medida} a {unidad_base}"}), 400
            else:
                cantidad_convertida = cantidad

            # Insertar o actualizar el insumo en la receta
            cursor.execute("""
                INSERT INTO receta_insumos (receta_id, insumo_id, cantidad)
                VALUES (?, ?, ?)
                ON CONFLICT(receta_id, insumo_id) DO UPDATE SET cantidad = ?
            """, (receta_id, insumo_id, cantidad_convertida, cantidad_convertida))

        conn.commit()
        conn.close()
        print("✅ Datos insertados correctamente en receta_insumos.")
        return jsonify({"message": "Receta actualizada correctamente"}), 200

    except sqlite3.Error as e:
        conn.rollback()
        print("❌ Error en la base de datos:", e)
        return jsonify({"error": "Error al actualizar insumos"}), 500

#LEER DATOS

@app.route('/api/insumos/<nombre>', methods=['GET'])
def get_insumo(nombre):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Normalizar el nombre eliminando espacios extra y convirtiéndolo a minúsculas
    cursor.execute("SELECT nombre, cantidad, unidad_medida, precio_unitario FROM insumos WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(?))", (nombre,))
    
    insumo = cursor.fetchone()
    conn.close()

    if insumo:
        return jsonify(dict(insumo))
    else:
        return jsonify({"error": "Insumo no encontrado"}), 404
    
# Agregar receta
@app.route('/api/recetas', methods=['POST'])
def agregar_receta():
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO recetas (nombre, precio_venta)
            VALUES (?, ?)
        """, (data['nombre'], data['precio_venta']))
        conn.commit()
        conn.close()
        return jsonify({"message": "Receta agregada correctamente"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": "Error al agregar receta"}), 500

# Modificar receta (nombre o precio)
@app.route('/api/recetas/<int:receta_id>', methods=['PUT'])
def modificar_receta(receta_id):
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE recetas
            SET nombre = ?, precio_venta = ?
            WHERE id = ?
        """, (data['nombre'], data['precio_venta'], receta_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Receta modificada correctamente"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": "Error al modificar receta"}), 500

# Eliminar receta
@app.route('/api/recetas/<int:receta_id>', methods=['DELETE'])
def eliminar_receta(receta_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM recetas WHERE id = ?", (receta_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Receta eliminada correctamente"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": "Error al eliminar receta"}), 500

#AGREGA STOCK Y PONDERA PRECIOS INGREDIENTES

@app.route('/api/insumos/actualizar_stock', methods=['PUT'])
def modificar_insumo_stock():
    data = request.json
    nombre = data['nombre']
    cantidad_nueva = data['cantidad']
    precio_nuevo = data['precio_unitario']

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    try:
        cursor = conn.cursor()
        
        # Obtener el estado actual del insumo
        cursor.execute("SELECT cantidad, precio_unitario FROM insumos WHERE nombre = ?", (nombre,))
        insumo = cursor.fetchone()
        
        if insumo is None:
            return jsonify({"error": "Insumo no encontrado"}), 404
        
        cantidad_anterior, precio_anterior = insumo

        # Calcular el nuevo stock y el precio promedio ponderado
        nueva_cantidad = cantidad_anterior + cantidad_nueva
        nuevo_precio = ((cantidad_anterior * precio_anterior) + (cantidad_nueva * precio_nuevo)) / nueva_cantidad

        # Actualizar la base de datos
        cursor.execute("""
            UPDATE insumos
            SET cantidad = ?, precio_unitario = ?
            WHERE nombre = ?
        """, (nueva_cantidad, nuevo_precio, nombre))

        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Stock actualizado correctamente",
            "nombre": nombre,
            "nueva_cantidad": nueva_cantidad,
            "nuevo_precio": nuevo_precio
        }), 200

    except sqlite3.Error as e:
        print("Error al modificar stock:", e)
        return jsonify({"error": "Error al modificar stock"}), 500
    
# Agregar insumo a una receta
@app.route('/api/recetas/agregar_insumo', methods=['POST'])
def agregar_insumo_a_receta():
    data = request.json
    receta_id = data.get('receta_id')
    insumo_id = data.get('insumo_id')
    cantidad_ingresada = data.get('cantidad')
    unidad_ingresada = data.get('unidad_medida')

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()

        # Obtener la unidad de medida original del insumo
        cursor.execute("SELECT unidad_medida FROM insumos WHERE id = ?", (insumo_id,))
        insumo = cursor.fetchone()

        if not insumo:
            return jsonify({"error": "Insumo no encontrado"}), 404

        unidad_original = insumo[0]

        # Conversión de unidades
        conversiones = {
            ("g", "kg"): 1000,   # 1000 g = 1 kg
            ("kg", "g"): 1 / 1000,
            ("ml", "l"): 1000,   # 1000 ml = 1 l
            ("l", "ml"): 1 / 1000
        }

        if unidad_ingresada != unidad_original:
            clave_conversion = (unidad_ingresada.lower(), unidad_original.lower())
            if clave_conversion in conversiones:
                cantidad_convertida = cantidad_ingresada / conversiones[clave_conversion]
            else:
                return jsonify({"error": "Conversión no soportada"}), 400
        else:
            cantidad_convertida = cantidad_ingresada

        # Insertar en la tabla receta_insumos con la cantidad convertida
        cursor.execute("""
            INSERT INTO receta_insumos (receta_id, insumo_id, cantidad)
            VALUES (?, ?, ?)
        """, (receta_id, insumo_id, cantidad_convertida))

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Insumo agregado a la receta correctamente",
            "receta_id": receta_id,
            "insumo_id": insumo_id,
            "cantidad_guardada": cantidad_convertida,
            "unidad_original": unidad_original
        }), 201

    except sqlite3.Error as e:
        print("Error al agregar insumo a receta:", e)
        return jsonify({"error": "Error en la base de datos"}), 500
    
# Fetch para ventas   
@app.route('/api/ventas', methods=['GET'])
def get_ventas():
    desde = request.args.get('desde')
    hasta = request.args.get('hasta')

    if not desde or not hasta:
        return jsonify({"error": "Debe proporcionar un rango de fechas válido"}), 400

    # 🔹 Formatear fechas correctamente para SQLite
    desde = desde.replace("T", " ")
    hasta = hasta.replace("T", " ")

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()

        # 🔹 Nueva consulta con suma de unidades y total de la venta
        cursor.execute("""
            SELECT v.fecha_venta, 
                   SUM(dv.unidades) AS unidades_totales, 
                   SUM(dv.subtotal) AS total
            FROM ventas v
            JOIN detalle_ventas dv ON v.id = dv.venta_id
            WHERE datetime(v.fecha_venta) BETWEEN datetime(?) AND datetime(?)
            GROUP BY v.id
            ORDER BY v.fecha_venta DESC
        """, (desde, hasta))

        ventas = cursor.fetchall()
        conn.close()

        # 🔹 Transformar los resultados en una lista de diccionarios con formato de fecha
        ventas_list = []
        for row in ventas:
            
            ventas_list.append({
                "fecha": row["fecha_venta"],
                "unidades_totales": row["unidades_totales"],
                "total": row["total"]
            })

        return jsonify(ventas_list)
    except sqlite3.Error as e:
        return jsonify({"error": "Error al obtener las ventas"}), 500




if __name__ == '__main__':
    app.run(debug=True)