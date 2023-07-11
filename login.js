document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.sign-in-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = form.querySelector('input[name="username"]').value;
        const password = form.querySelector('input[name="password"]').value;
        console.log(username);
        console.log(password);

        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if ('message' in data && data.message === 'Inicio de sesión exitoso') {
                window.location.href = 'http://127.0.0.1:5501/Gestion_ISP/Clientes.html';
            } else if ('error' in data) {
                console.log(data.error);
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    });
});
