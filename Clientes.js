
//alta con jquery
$("#btnNuevo").click(function () {
    $("#formClientes").trigger("reset");
    $(".modal-header").css("background-color", "#28a745");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Nuevo Cliente");
    $("#btnSubmit").text("Guardar");
    $("#formClientes").attr("data-action", "guardar");
    $("#modalCRUD").modal("show");
});

//boton editar
$(document).on("click", "#btnEditar", function () {
    // Obtener los valores del modal de información del cliente
    var dni = $("#dni-i").text().trim();
    var nombre = $("#nombre-i").text().trim();
    var apellido = $("#apellido-i").text().trim();
    var direccion = $("#direccion-i").text().trim();
    var telefono = $("#telefono-i").text().trim();
    var observaciones = $("#observaciones-i").text().trim();
    var servicio = $("#servicio-i").text().trim();
    var zona = $("#zona-i").text().trim();

    // Llenar el modal de edición con los valores obtenidos
    $("#dni").val(dni);
    $("#nombre").val(nombre);
    $("#apellido").val(apellido);
    $("#domicilio").val(direccion);
    $("#telefono").val(telefono);
    $("#observaciones").val(observaciones);
    $("#servicio").val(servicio);
    $("#zona").val(zona);

    $(".modal-title").text("Editar Cliente");
    $("#btnSubmit").text("Guardar");
    $("#formClientes").attr("data-action", "editar");
    $("#modalCRUD").modal("show");
});

fetch('http://127.0.0.1:5000/clientes')
    .then(response => response.json())
    .then(data => {
        // Crear filas con los datos obtenidos y añadirlos a la tabla
        //se agrgego el boton registrar el pago
        let filas = '';
        data.forEach(cliente => {
            filas += `<tr>
                <td>${cliente.idcliente}</td>
                <td>${cliente.dni}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.nombre}</td>
                <td><div class='text-center'><button class='btnMasInfo'>Info</button><button class='btnRegistrarPago'>Pago</button></div></td>
                </tr>`;
        });
        document.getElementById('tablaClientes').innerHTML = filas;
        $(document).ready(function () {
            tablaClientes = $('#Clientes').DataTable({
                scrollX: true,
                // botones editar y eliminar en la tabla
                "columnDefs": [{
                    "targets": 4,
                    "data": null,
                    //se agrego el boton registrar el pago
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-info btnInfo'><i class='bx bx-plus-circle'></i></button><button class='btn btn-outline-success btnRegistrarPago'><i class='bx bx-dollar-circle'></i></button></div></div>"
                }],
                // lenguaje
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron resultados",
                    "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sSearch": "Buscar:",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "sProcessing": "Procesando...",
                }
            });
        });
    })
    .catch(error => console.error(error));

let idCliente = null;
//botón INFO  
$(document).on("click", ".btnInfo", function () {
    var fila = $(this).closest("tr");
    idCliente = fila.find('td:eq(0)').text(); // Obtener el ID del cliente

    fetch("http://127.0.0.1:5000/clientesTotal")
        .then(response => response.json())
        .then(data => {
            var cliente = data.find(c => c.idcliente === parseInt(idCliente)); // Buscar el cliente por su ID

            // Actualizar los elementos del modal con los datos del cliente
            $("#id-i").text(idCliente);
            $("#dni-i").text(cliente.dni);
            $("#nombre-i").text(cliente.nombre);
            $("#apellido-i").text(cliente.apellido);
            $("#direccion-i").text(cliente.direccion);
            $("#telefono-i").text(cliente.telefono);
            $("#estado-i").text(cliente.estado);
            $("#observaciones-i").text(cliente.observaciones);
            $("#fechaAlta-i").text(cliente.fechaAlta);
            $("#servicio-i").text(cliente.servicio);
            $("#zona-i").text(cliente.zona);
            fetch("http://127.0.0.1:5000/clienteDeuda/" + idCliente)
                .then(response => response.json())
                .then(deuda => {
                    var deudaInfo = deuda.map(d => d.mes + "/$" + d.monto); // Crear un array con la información de la deuda en el formato deseado
                    var deudaText = deudaInfo.join(", "); // Unir los elementos del array con una coma y un espacio

                    // Actualizar el elemento <p> con la información de la deuda
                    $("#deuda-i").text("Deuda: " + deudaText);
                })
            actualizarBotonBaja()

            $("#modal-info").modal("show");
        })
        .catch(error => console.error(error));
});

// Obtener el formulario
let url = "";

// Escuchar el evento submit del formulario
$("#formClientes").submit(function (event) {
    event.preventDefault();
    var fila = $(this).closest("tr");
    var action = $(this).attr("data-action");

    if (action === "guardar") {
        // Crear el objeto JSON
        console.log("Submit button clicked");
        const idServicio = parseInt(document.querySelector('#servicio').value);
        const zona = parseInt(document.querySelector('#zona').value);
        const cliente = {
            dni: document.querySelector('#dni').value,
            apellido: document.querySelector('#apellido').value,
            nombre: document.querySelector('#nombre').value,
            direccion: document.querySelector('#domicilio').value,
            telefono: document.querySelector('#telefono').value,
            estado: "A",
            observaciones: document.querySelector('#observaciones').value,
            idServicio: idServicio,
            zona: zona
        };
        url = "http://127.0.0.1:5000/guardarCliente";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
            .then(response => {
                if (response.ok) {
                    swal('Cliente guardado exitosamente', '', 'success').then(() => {
                        setTimeout(() => {
                            location.reload();
                        }, 1000); // recarga la página después de 2 segundos
                    });
                    $("#modalCRUD").modal("hide");
                    // Hacer algo después de que el cliente se haya guardado correctamente
                } else {
                    console.error('Error al guardar el cliente');
                    // Hacer algo en caso de que ocurra un error al guardar el cliente
                }
            })
            .catch(error => {
                console.error('Error al guardar el cliente', error);
                // Hacer algo en caso de que ocurra un error al enviar la solicitud
            });
    } else if (action === "editar") {

        const cliente = {
            dni: document.querySelector('#dni').value,
            apellido: document.querySelector('#apellido').value,
            nombre: document.querySelector('#nombre').value,
            direccion: document.querySelector('#domicilio').value,
            telefono: document.querySelector('#telefono').value,
            estado: "A",
            observaciones: document.querySelector('#observaciones').value,
            idServicio: parseInt(document.querySelector('#servicio').value),
            zona: parseInt(document.querySelector('#zona').value)
        };

        url = `http://127.0.0.1:5000/editarCliente/` + idCliente;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Cliente guardado exitosamente');
                    //alert("Cliente guardado correctamente");
                    swal('Cliente editado exitosamente', '', 'success').then(() => {
                        setTimeout(() => {
                            location.reload();
                        }, 1000); // recarga la página después de 2 segundos
                    });
                    $("#modalCRUD").modal("hide");
                    //location.reload();
                    // Hacer algo después de que el cliente se haya guardado correctamente
                } else {
                    console.error('Error al guardar el cliente');
                    // Hacer algo en caso de que ocurra un error al guardar el cliente
                }
            })
    }
});

//baja logica de cliente
$("#btnBaja").click(function () {
    var idCliente = $("#id-i").text();
    var estadoCliente = $("#estado-i").text();
    var cliente = {
        idCliente: idCliente
    };

    if (estadoCliente === "B") {
        cliente.estado = "A"; // Cambiar el estado a "Alta"
    } else if (estadoCliente === "A") {
        cliente.estado = "B"; // Cambiar el estado a "Baja"
    }

    fetch("http://127.0.0.1:5000/actualizarEstado/" + idCliente, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
        .then(response => {
            if (response.ok) {
                swal('Cambio de estado exitoso', '', 'success').then(() => {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                });        
            } else {
                // Hubo un error al actualizar el estado del cliente
                console.error('Error al actualizar el estado del cliente');
            }
        })
        .catch(error => {
            // Hubo un error al enviar la solicitud
            console.error('Error al enviar la solicitud', error);
        });
});



document.getElementById('btnGenerarDeuda').addEventListener('click', function () {
    // Realizar la solicitud POST al endpoint /generarDeuda
    fetch('http://127.0.0.1:5000/generarDeuda', {
        method: 'POST'
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al generar la deuda');
            }
        })
        .then(function (data) {
            console.log(data.message);
        })
        .catch(function (error) {
            console.error('Error:', error.message);
        });
});





function actualizarBotonBaja() {
    // Obtener el estado del cliente
    var estadoCliente = document.getElementById("estado-i").textContent;

    // Obtener referencia al botón de "Baja"
    var btnBaja = document.getElementById("btnBaja");

    // Verificar el estado y realizar los cambios necesarios
    if (estadoCliente === "B") {
        btnBaja.textContent = "Alta"; // Cambiar el texto del botón a "Alta"
        btnBaja.classList.remove("btn-danger"); // Eliminar la clase "btn-danger"
        btnBaja.classList.add("btn-success"); // Agregar la clase "btn-success" (color verde)
    } else if (estadoCliente === "A") {
        btnBaja.textContent = "Baja"; // Restaurar el texto original del botón a "Baja"
        btnBaja.classList.remove("btn-success"); // Eliminar la clase "btn-success"
        btnBaja.classList.add("btn-danger"); // Agregar la clase "btn-danger" (color rojo)
    }
}

