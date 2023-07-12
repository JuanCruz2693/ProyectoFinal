// Realizar solicitud a la API para obtener los datos de clientesTotal
fetch('/clientesTotal')
.then(response => response.json())
.then(data => {
    document.getElementById('clientesTotal').textContent = data[0].cantidad;
})
.catch(error => console.error(error));