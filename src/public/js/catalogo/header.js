"use strict";
// Define el entorno
let url;
const esDesarollo = window.location.hostname.includes('localhost'); // Revisa el url actual
if (esDesarollo) { // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
    url = 'http://localhost:8080';
}
else { // Si no tiene localhost define el url en la pagina web para la peticion
    url = 'https://embike-223a165b4ff6.herokuapp.com';
}
// Se definen los botones de "cuenta" o de "iniciar sesion" segun si el usuario esta o no con la sesion activa
const botonIniciarSesion = document.getElementById('botonIniciarSesion');
const botonUsuario = document.getElementById('botonUsuario');
const botonIniciarSesionResponsive = document.getElementById('header-resposive__div__buttom-inicioSesion');
const tokenAcceso = localStorage.getItem('tokenAcceso'); // Recupera el token de acceso desde el localStorage
if (tokenAcceso) { // Si el token de acceso existe entonces lo verifica
    // Verificacion
    // Si el token es valido entonces modifica la parte visual del boton para reflejar que la sesion esta activa
    botonIniciarSesion.classList.add('header__botones-noActive');
    botonUsuario.classList.remove('header__botones-noActive');
}
else { // Si no existe un token de acceso entonces no hace nada
}
// Cerrar sesion
const botonCerrarSesion = document.getElementById('botonUsuario__lista__salir');
botonCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('tokenAcceso'); // Elimina el token de acceso
    window.location.assign(url); // Redirije al usuario al inicio de la pagina
});
