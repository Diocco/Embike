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
const botonIniciarSesionResponsive = document.getElementById('header-responsive__a-iniciarSesion');
const botonUsuario = document.getElementById('botonUsuario');
const botonUsuarioResponsive = document.getElementById('header-responsive__div-cuenta');
const tokenAcceso = localStorage.getItem('tokenAcceso'); // Recupera el token de acceso desde el localStorage
if (tokenAcceso) { // Si el token de acceso existe entonces lo verifica
    // Verificacion
    try {
        fetch(url + '/api/usuarios/token', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                'tokenAcceso': `${tokenAcceso}` },
        })
            .then(response => response.json())
            .then(data => {
            if (data.errors) { // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
                (data.errors).forEach((error) => {
                    console.log(error.msg);
                });
                // Borra el token con problemas
                localStorage.removeItem('tokenAcceso'); // Elimina el token de acceso
                window.location.assign(url); // Redirije al usuario al inicio de la pagina
            }
            else { // Si no hay errores:
                // Si el token es valido entonces modifica la parte visual para reflejar que la sesion esta activa
                // Intercambia los botones de "iniciar sesion" por el de "Mi cuenta" 
                botonIniciarSesion.classList.add('noActive');
                botonIniciarSesionResponsive.classList.add('noActive');
                botonUsuario.classList.remove('noActive');
                botonUsuarioResponsive.classList.remove('noActive');
                // Coloca la informacion del usuario en la seccion de "Mi cuenta"
                const fotoUsuario = document.getElementById('div-nombre__div-foto');
                const nombreUsuario = document.getElementById('div-nombre__div-nombre');
                const correoUsuario = document.getElementById('div-informacion__div-correo');
                const idUsuario = document.getElementById('div-informacion__div-ID');
                if (data.usuarioVerificado.foto) { // Si el usuario tiene foto de perfil entonces la coloca
                    // COMPLETAR
                    console.log('HAY QUE COMPLETAR ESTO');
                }
                else { // Si el usuario no tiene foto entonces pone como imagen su inicial de nombre o sus dos primeras iniciales
                    const nombres = data.usuarioVerificado.nombre.split(' '); // Divide el nombre de usuario por la cantidad de espacios que tiene
                    if (nombres.length > 1) { // Si el usuario tiene mas de un espacio entonces coloca la primer letra de las primeros dos palabras del nombre
                        fotoUsuario.textContent = nombres[0][0].toUpperCase() + nombres[1][0].toUpperCase();
                    }
                    else {
                        // Si solo tiene una palabra como nombre, muestra las primeras dos letras de esa palabra
                        fotoUsuario.textContent = nombres[0].slice(0, 2).toUpperCase();
                    }
                }
                nombreUsuario.textContent = data.usuarioVerificado.nombre; // Coloca el nombre del usuario
                correoUsuario.textContent = data.usuarioVerificado.correo; // Coloca el correo del usuario
                idUsuario.textContent = `ID: ${data.usuarioVerificado.uid}`; // Coloca el id del usuario
            }
        });
    }
    catch (error) {
        console.log(error);
        // Borra el token con problemas
        localStorage.removeItem('tokenAcceso'); // Elimina el token de acceso
        window.location.assign(url); // Redirije al usuario al inicio de la pagina
    }
}
else { // Si no existe un token de acceso entonces no hace nada
}
// Alternar menu del boton de "menu" responsive
const menuVentanaResponsive = document.getElementById('div-menu__ul-opciones');
const botonMenuResposive = document.getElementById('header-responsive__div-menu');
botonMenuResposive.addEventListener('click', () => {
    menuVentanaResponsive.classList.add('div-menu__ul-opciones-active');
});
const botonMenuVolver = document.getElementById('div-menu__div-volver');
botonMenuVolver.addEventListener('click', (event) => {
    menuVentanaResponsive.classList.remove('div-menu__ul-opciones-active');
    event.stopPropagation(); // Evita que el evento ejecute el evento del elemento padre, es decir, el evento de "botonUsuarioResponsive"
});
// Alternar "mi cuenta" del boton de cuenta responsive
const cuentaVentanaResponsive = document.getElementById('div-cuenta__div-ventana');
botonUsuarioResponsive.addEventListener('click', () => {
    cuentaVentanaResponsive.classList.add('div-cuenta__div-ventana-active');
});
const botonCuentaVolver = document.getElementById('div-ventana__div-volver');
botonCuentaVolver.addEventListener('click', (event) => {
    cuentaVentanaResponsive.classList.remove('div-cuenta__div-ventana-active');
    event.stopPropagation(); // Evita que el evento ejecute el evento del elemento padre, es decir, el evento de "botonUsuarioResponsive"
});
// Cerrar sesion
const botonCerrarSesion = document.getElementById('botonUsuario__lista__salir');
const botonCerrarSesionResponsive = document.getElementById('ul-opciones__li-cerrarSesion');
botonCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('tokenAcceso'); // Elimina el token de acceso
    window.location.assign(url); // Redirije al usuario al inicio de la pagina
});
botonCerrarSesionResponsive.addEventListener('click', () => {
    localStorage.removeItem('tokenAcceso'); // Elimina el token de acceso
    window.location.assign(url); // Redirije al usuario al inicio de la pagina
});
// Barra de busqueda
// Verifica que refleja busqueda actual
const inputBusqueda = document.getElementById('header__form-barraBusqueda__input');
const inputBusquedaResponsive = document.getElementById('header-responsive__form-barraBusqueda__input');
document.addEventListener("DOMContentLoaded", () => {
    const urlObjeto = new URL(window.location.href); // Crea un objeto para definir, o ver, los query elements mas facilmente
    const palabraBuscada = urlObjeto.searchParams.get('palabraBuscada'); // Almacena la palabra buscada previamente si existe
    if (palabraBuscada) { // Si la palabra buscada existe
        inputBusqueda.value = palabraBuscada; // La define como valor en el input de la barra de busqueda
        inputBusquedaResponsive.value = palabraBuscada; // La define como valor en el input de la barra de busqueda
    }
});
// Escucha una nueva busqueda
const formularioBusqueda = document.getElementById('header__form-barraBusqueda');
const formularioBusquedaResponsive = document.getElementById('header-responsive__form-barraBusqueda');
formularioBusqueda.addEventListener('submit', (event) => {
    event.preventDefault();
    const esCatalogo = window.location.pathname.includes('/catalogo'); // Verifica si se esta en el catalogo
    if (esCatalogo) {
        // Define los query element 
        const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
        urlObjeto.searchParams.set('palabraBuscada', inputBusqueda.value); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
        buscarProductos(); // Realiza la busqueda de los productos con el nuevo filtro
    }
    else {
        location.assign(`/catalogo?palabraBuscada=${inputBusqueda.value}`); // Redirije al usuario a la pagina del catalogo con la plabra buscada como parametro de busqueda
    }
});
formularioBusquedaResponsive.addEventListener('submit', (event) => {
    event.preventDefault();
    const esCatalogo = window.location.pathname.includes('/catalogo'); // Verifica si se esta en el catalogo
    if (esCatalogo) {
        // Define los query element 
        const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
        urlObjeto.searchParams.set('palabraBuscada', inputBusquedaResponsive.value); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
        buscarProductos(); // Realiza la busqueda de los productos con el nuevo filtro
    }
    else {
        location.assign(`/catalogo?palabraBuscada=${inputBusquedaResponsive.value}`); // Redirije al usuario a la pagina del catalogo con la plabra buscada como parametro de busqueda
    }
});
