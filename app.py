from flask import Flask
from flask import request, jsonify, session
from flaskext.mysql import MySQL
from flask_login import login_required
from flask_cors import CORS


app=Flask(__name__)
CORS(app)
mysql = MySQL()
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '261093'
app.config['MYSQL_DATABASE_DB'] = 'gestion_isp'
mysql.init_app(app)
app.secret_key = 'mysecretkey'

@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    
    conn = mysql.connect()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM usuario WHERE usuario=%s AND contrasenia=%s', (username, password))
    user = cursor.fetchone()
    
    conn.close()
    
    if user:
        session['username'] = username
        return jsonify({'message': 'Inicio de sesión exitoso'})
    else:
        return jsonify({'error': 'Credenciales inválidas'})


@app.route('/clientes')
def index():
    sql = "SELECT idcliente, dni, apellido, nombre FROM cliente"
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql)
    empleados = cursor.fetchall()
    conn.commit()
    empleados_dict = []
    for empleado in empleados:
        empleado_dict = {
            'idcliente': empleado[0],
            'dni': empleado[1],
            'apellido': empleado[2],
            'nombre': empleado[3]
        }
        empleados_dict.append(empleado_dict)
    return jsonify(empleados_dict)

@app.route('/clientesTotal')
def clientes():
    sql = "SELECT * FROM cliente"
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql)
    empleados = cursor.fetchall()
    conn.commit()
    empleados_dict = []
    for empleado in empleados:
        empleado_dict = {
            'idcliente': empleado[0],
            'dni': empleado[1],
            'apellido': empleado[2],
            'nombre': empleado[3],
            'direccion': empleado[4],
            'telefono': empleado[5],
            'estado': empleado[6],
            'observaciones': empleado[7],
            'fechaAlta': empleado[8],
            'servicio': empleado[10],
            'zona': empleado[10]
        }
        empleados_dict.append(empleado_dict)
    return jsonify(empleados_dict)

@app.route("/guardarCliente", methods=["POST"])
def guardar():
    data = request.get_json()
    dni = data.get("dni")
    apellido = data.get("apellido")
    nombre = data.get("nombre")
    direccion = data.get("direccion")
    telefono = data.get("telefono")
    estado = data.get("estado")
    observaciones = data.get("observaciones")
    idServicio = data.get("idServicio")
    idZona = data.get("zona")
    sql = "INSERT INTO cliente (DNI, apellido, nombre, direccion, telefono, estado, observaciones, FechaAlta, idServicio, idZona) VALUES (%s, %s, %s, %s, %s, %s, %s, CURDATE(), %s, %s);"
    values = (dni, apellido, nombre, direccion, telefono, estado, observaciones, idServicio, idZona)
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql, values)
    conn.commit()

    return "Cliente guardado exitosamente"


@app.route("/editarCliente/<int:idCliente>", methods=["PUT"])
def editar_cliente(idCliente):
    data = request.get_json()
    dni = data.get("dni")
    apellido = data.get("apellido")
    nombre = data.get("nombre")
    direccion = data.get("direccion")
    telefono = data.get("telefono")
    observaciones = data.get("observaciones")
    idServicio = data.get("idServicio")
    idZona = data.get("zona")

    sql = "UPDATE cliente SET dni = %s, apellido = %s, nombre = %s, direccion = %s, telefono = %s, observaciones = %s, idServicio = %s, idZona = %s WHERE idCliente = %s"
    values = (dni, apellido, nombre, direccion, telefono, observaciones, idServicio, idZona, idCliente)

    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql, values)
    conn.commit()

    return "Cliente actualizado exitosamente"


@app.route("/actualizarEstado/<int:idCliente>", methods=["PUT"])
def editarEstado(idCliente):
    data = request.get_json()
    estado = data.get("estado")

    sql = "UPDATE cliente SET estado = %s WHERE idCliente = %s"
    values = (estado, idCliente)

    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql, values)
    conn.commit()

    return "Cliente actualizado exitosamente"

@app.route('/generarDeuda', methods=['POST'])
def generar_deuda():
    # Realizar la llamada al procedimiento almacenado
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.callproc('GenerarDeuda')
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deuda generada exitosamente'})


@app.route('/clienteDeuda/<int:idCliente>', methods=['GET'])
def obtener_deuda_cliente(idCliente):
    sql = "SELECT c.idcliente, d.iddeuda, monto, d.mes FROM clientedeuda c INNER JOIN deuda d ON c.iddeuda = d.iddeuda WHERE c.idcliente = %s"
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql, (idCliente,))
    clientes_deuda = cursor.fetchall()
    conn.commit()

    clientes_dict = []
    for cliente_deuda in clientes_deuda:
        cliente_dict = {
            'idcliente': cliente_deuda[0],
            'iddeuda': cliente_deuda[1],
            'monto': cliente_deuda[2],
            'mes': cliente_deuda[3]
        }
        clientes_dict.append(cliente_dict)

    return jsonify(clientes_dict)


if __name__ == "__main__":
    app.run()