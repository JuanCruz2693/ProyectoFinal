
//alta con jquery
$("#btnNuevo").click(function () {
    $("#formClientes").trigger("reset");
    $(".modal-header").css("background-color", "#28a745");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Nuevo Cliente");
    $("#btnSubmit").text("Guardar");
    $("#modalCRUD").modal("show");
});

const form = document.querySelector('#formClientes');
let url = "http://127.0.0.1:5000/guardarCliente"; // La URL de la API donde se guardarán los datos

// Escuchar el evento submit del formulario
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const idServicio = parseInt(document.querySelector('#servicio').value);
    const zona = parseInt(document.querySelector('#zona').value);

    // Crear el objeto JSON con los datos del formulario
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
    console.log(cliente)

    // Enviar el JSON a la API
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
        .then(response => {
            if (response.ok) {
                // Hacer algo después de que los datos se hayan guardado correctamente
                console.log('Datos guardados correctamente');
            } else {
                // Hacer algo en caso de que ocurra un error al guardar los datos
                console.error('Error al guardar los datos');
            }
        })
        .catch(error => {
            // Hacer algo en caso de que ocurra un error al enviar la solicitud
            console.error('Error al enviar la solicitud', error);
        });
});

var idcliente;
//botón INFO  
$(document).on("click", ".btnInfo", function () {
    var fila = $(this).closest("tr");
    var idCliente = fila.find('td:eq(0)').text(); // Obtener el ID del cliente

    fetch("http://127.0.0.1:5000/clientesTotal")
        .then(response => response.json())
        .then(data => {
            var cliente = data.find(c => c.idcliente === parseInt(idCliente)); // Buscar el cliente por su ID

            // Actualizar los elementos del modal con los datos del cliente
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

            $("#modal-info").modal("show");
        })
        .catch(error => console.error(error));
});

fetch('http://127.0.0.1:5000/clientes')
    .then(response => response.json())
    .then(data => {
        // Crear filas con los datos obtenidos y añadirlos a la tabla
        let filas = '';
        data.forEach(cliente => {
            filas += `<tr>
                <td>${cliente.idcliente}</td>
                <td>${cliente.dni}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.nombre}</td>
                <td><div class='text-center'><button class='btnMasInfo'>Info</button></div></td>
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
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary btnInfo'><i class='fa-solid fa-eye'></i></button>"
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

var idcliente;
//botón EDITAR    
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

    console.log("dni:", dni);
    console.log("nombre:", nombre);
    console.log("apellido:", apellido);
    console.log("direccion:", direccion);
    console.log("telefono:", telefono);
    console.log("observaciones:", observaciones);
    console.log("servicio:", servicio);
    console.log("zona:", zona);

    // Llenar el modal de edición con los valores obtenidos
    $("#dni").val(dni);
    $("#nombre").val(nombre);
    $("#apellido").val(apellido);
    $("#domicilio").val(direccion);
    $("#telefono").val(telefono);
    $("#observaciones").val(observaciones);
    $("#servicio").val(servicio);
    $("#zona").val(zona);

    // Modificar el título del modal de edición
    $(".modal-title").text("Editar Cliente");

    // Modificar el texto del botón de envío del formulario
    $("#btnSubmit").text("Editar");

    // Establecer la acción del formulario como "editar"
    $("#formClientes").attr("data-action", "editar");

    // Abrir el modal de edición
    $("#modalCRUD").modal("show");
});
