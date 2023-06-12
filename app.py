from flask import Flask
from flask import render_template, request, jsonify
from flaskext.mysql import MySQL
from flask_cors import CORS


app=Flask(__name__)
CORS(app)
mysql = MySQL()
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '261093'
app.config['MYSQL_DATABASE_DB'] = 'gestion_isp'
mysql.init_app(app)

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
            'servicio': empleado[9],
            'zona': empleado[10]
        }
        empleados_dict.append(empleado_dict)
    return jsonify(empleados_dict)






if __name__=='__main__':
    app.run()