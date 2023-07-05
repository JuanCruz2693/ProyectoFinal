
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

            $("#modal-info").modal("show");
        })
        .catch(error => console.error(error));
});

// Obtener el formulario
let url = "";

// Escuchar el evento submit del formulario
$("#formClientes").submit(function(event) {
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

    // Mostrar el objeto JSON en la consola
    console.log(cliente);
        // Lógica para la acción "Guardar"
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
                        }, 2000); // recarga la página después de 2 segundos
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
        
        console.log(cliente)



        url = `http://127.0.0.1:5000/editarCliente/`+ idCliente;
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
                    }, 2000); // recarga la página después de 2 segundos
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



