"use strict";
document.addEventListener("DOMContentLoaded", function () {
    let urlInicioSesion;
    let urlRegistro;
    const esDesarollo = window.location.hostname.includes('localhost'); // Revisa el url actual
    const botonRegistrarse = document.getElementById('inicioSesion__formulario__registrarse');
    const volverIniciarSesion = document.getElementById('volverIniciarSesion');
    const formularioRegistrarse = document.getElementById('registrarse__formulario');
    const formularioIniciarSesion = document.getElementById('inicioSesion__formulario');
    if (esDesarollo) { // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
        urlInicioSesion = 'http://localhost:8080/api/auth/login';
        urlRegistro = 'http://localhost:8080/api/usuarios';
    }
    else { // Si no tiene localhost define el url en la pagina web para la peticion
        urlInicioSesion = 'https://embike-223a165b4ff6.herokuapp.com/api/auth/login';
        urlRegistro = 'https://embike-223a165b4ff6.herokuapp.com/api/usuarios';
    }
    // Si se hace click en "Registrarse" se muestra el formulario para registrarse
    botonRegistrarse.addEventListener('click', () => {
        formularioRegistrarse.classList.add('registrarse__formulario-active');
        formularioIniciarSesion.classList.remove('inicioSesion__formulario-active');
    });
    // Si se hace click en "Iniciar sesion" se muestra el formulario para iniciar sesion
    volverIniciarSesion.addEventListener('click', () => {
        formularioRegistrarse.classList.remove('registrarse__formulario-active');
        formularioIniciarSesion.classList.add('inicioSesion__formulario-active');
    });
    // Ventana de inicio de sesion
    const emailInput = document.getElementById('inicioSesion__formulario__ingresarCorreo');
    const mensajeErrorEmail = document.getElementById('errorEmail');
    const passwordInput = document.getElementById('inicioSesion__formulario__ingresarPassword');
    const mensajeErrorPassword = document.getElementById('errorPassword');
    formularioIniciarSesion.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página
        // Elimina, si esta presente, los estados de error
        emailInput.classList.remove('boton__enError');
        passwordInput.classList.remove('boton__enError');
        mensajeErrorEmail.textContent = '';
        mensajeErrorPassword.textContent = '';
        const data = {
            correo: emailInput.value,
            password: passwordInput.value
        };
        fetch(urlInicioSesion, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // Convertir los datos a JSON
        })
            .then(response => response.json()) // Parsear la respuesta como JSON
            .then(data => {
            if (data.errors) { // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
                (data.errors).forEach((error) => {
                    if (error.path === 'correo') { // Si el error es del correo:
                        emailInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo
                        if (!mensajeErrorEmail.textContent) { // Verifica si tenia un mensaje de error previo
                            mensajeErrorEmail.textContent = error.msg; // Si no tenia, le coloca 
                        }
                    }
                    else { // Si el error no es del correo, entonces deberia ser de la password
                        passwordInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo 
                        if (!mensajeErrorPassword.textContent) { // Verifica si tenia un mensaje de error previo
                            mensajeErrorPassword.textContent = error.msg; // Si no tenia, le coloca 
                        }
                    }
                });
            }
            else { // Si el servidor devuelve un inicio de sesion exitoso:
                console.log("todo piola");
            }
        })
            .catch(error => {
            console.error(error);
        });
    });
    // Si se hace click en email y estaba marcado como con un error, lo remueve
    emailInput.addEventListener('click', (event) => {
        emailInput.classList.remove('boton__enError');
        mensajeErrorEmail.textContent = null;
    });
    // Si se hace click en password y estaba marcado como con un error, lo remueve
    passwordInput.addEventListener('click', (event) => {
        passwordInput.classList.remove('boton__enError');
        mensajeErrorPassword.textContent = null;
    });
    // Ventana de registrarse
    const nombreInput = document.getElementById('registrarse__formulario__ingresarNombre');
    const mensajeErrorNombre = document.getElementById('errorNombreRegistro');
    const registroEmailInput = document.getElementById('registrarse__formulario__ingresarCorreo');
    const mensajeErrorEmailRegistro = document.getElementById('errorEmailRegistro');
    const registroPasswordInput = document.getElementById('registrarse__formulario__ingresarPassword');
    const mensajeErrorPasswordRegistro = document.getElementById('errorPasswordRegistro');
    const registroPasswordRepetirInput = document.getElementById('registrarse__formulario__repetirPassword');
    const mensajeErrorPasswordRepetirRegistro = document.getElementById('errorRepetirPasswordRegistro');
    formularioRegistrarse.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página
        // Elimina, si esta presente, los estados de error
        nombreInput.classList.remove('boton__enError');
        registroPasswordRepetirInput.classList.remove('boton__enError');
        registroPasswordInput.classList.remove('boton__enError');
        registroEmailInput.classList.remove('boton__enError');
        mensajeErrorNombre.textContent = '';
        mensajeErrorEmailRegistro.textContent = '';
        mensajeErrorPasswordRegistro.textContent = '';
        mensajeErrorPasswordRepetirRegistro.textContent = '';
        // Compara si las contraseñas introducidas son iguales
        if (registroPasswordInput.value && registroPasswordRepetirInput.value) { // Primero verifica que ambas no sean nulas
            if (!(registroPasswordInput.value === registroPasswordRepetirInput.value)) { // Luego verifican que sean iguales, y si no lo son:
                registroPasswordRepetirInput.classList.add('boton__enError');
                mensajeErrorPasswordRepetirRegistro.textContent = 'Las contraseñas introducidas no coinciden';
            }
            else { // Si las contraseñas son iguales entonces se realiza la peticion POST
                const data = {
                    nombre: nombreInput.value,
                    password: registroPasswordInput.value,
                    correo: registroEmailInput.value,
                    rol: 'usuario',
                    activo: 'true',
                    google: 'false'
                };
                fetch(urlRegistro, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data) // Convertir los datos a JSON
                })
                    .then(response => response.json()) // Parsear la respuesta como JSON
                    .then(data => {
                    if (data.errors) { // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
                        (data.errors).forEach((error) => {
                            if (error.path === 'correo') { // Si el error es del correo:
                                registroEmailInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo
                                if (!mensajeErrorEmailRegistro.textContent) { // Verifica si tenia un mensaje de error previo
                                    mensajeErrorEmailRegistro.textContent = error.msg; // Si no tenia, le coloca 
                                }
                            }
                            else if (error.path === 'nombre') {
                                nombreInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo
                                if (!mensajeErrorNombre.textContent) { // Verifica si tenia un mensaje de error previo
                                    mensajeErrorNombre.textContent = error.msg; // Si no tenia, le coloca 
                                }
                            }
                            else { // Si el error no es del nombre, entonces deberia ser de la password
                                registroPasswordInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo 
                                if (!mensajeErrorPasswordRegistro.textContent) { // Verifica si tenia un mensaje de error previo
                                    mensajeErrorPasswordRegistro.textContent = error.msg; // Si no tenia, le coloca 
                                }
                            }
                        });
                    }
                    else { // Si el servidor devuelve un registro exitoso:
                        console.log("todo piola");
                    }
                })
                    .catch(error => {
                    console.error(error);
                });
            }
        }
    });
    // Si se hace click en el nombre y estaba marcado como con un error, lo remueve
    nombreInput.addEventListener('click', (event) => {
        nombreInput.classList.remove('boton__enError');
        mensajeErrorNombre.textContent = null;
    });
    // Si se hace click en email y estaba marcado como con un error, lo remueve
    registroEmailInput.addEventListener('click', (event) => {
        registroEmailInput.classList.remove('boton__enError');
        mensajeErrorEmailRegistro.textContent = null;
    });
    // Si se hace click en password y estaba marcado como con un error, lo remueve
    registroPasswordInput.addEventListener('click', (event) => {
        registroPasswordInput.classList.remove('boton__enError');
        mensajeErrorPasswordRegistro.textContent = null;
    });
    // Si se hace click en password y estaba marcado como con un error, lo remueve
    registroPasswordRepetirInput.addEventListener('click', (event) => {
        registroPasswordRepetirInput.classList.remove('boton__enError');
        mensajeErrorPasswordRepetirRegistro.textContent = null;
    });
});