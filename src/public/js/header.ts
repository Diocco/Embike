import { text } from "express";
import { buscarProductos } from "./catalogo.js";
import { usuario } from "../../models/interfaces/usuario.js";
import { url, usuarioVerificado } from "./global.js";

const reflejarSesionActiva=(informacionUsuario:usuario)=>{

    // Se definen los botones de "cuenta" o de "iniciar sesion" segun si el usuario esta o no con la sesion activa
    const botonIniciarSesion:HTMLAnchorElement = document.getElementById('botonIniciarSesion')! as HTMLAnchorElement
    const botonIniciarSesionResponsive:HTMLAnchorElement = document.getElementById('header-responsive__a-iniciarSesion')! as HTMLAnchorElement
    const botonUsuario:HTMLElement = document.getElementById('botonUsuario')!
    const botonUsuarioResponsive:HTMLElement = document.getElementById('header-responsive__div-cuenta')!

    // Intercambia los botones de "iniciar sesion" por el de "Mi cuenta" 
    botonIniciarSesion.classList.add('noActive')
    botonIniciarSesionResponsive.classList.add('noActive')
    botonUsuario.classList.remove('noActive')
    botonUsuarioResponsive.classList.remove('noActive')
    
    // Coloca la informacion del usuario en la seccion de "Mi cuenta"
    const fotoUsuario = document.getElementById('div-nombre__div-foto')! as HTMLDivElement
    const nombreUsuario = document.getElementById('div-nombre__div-nombre')! as HTMLDivElement
    const correoUsuario = document.getElementById('div-informacion__div-correo')! as HTMLDivElement
    const idUsuario = document.getElementById('div-informacion__div-ID')! as HTMLDivElement
    
    // Verifica que el usuario tenga foto de perfil
    if(informacionUsuario.img){ // Si el usuario tiene foto de perfil entonces la coloca
        fotoUsuario.style.backgroundImage=`url(../img/fotosPerfil/${informacionUsuario.img})`
    }else{// Si el usuario no tiene foto entonces pone como imagen su inicial de nombre o sus dos primeras iniciales
        const nombres:string[] = informacionUsuario.nombre.split(' '); // Divide el nombre de usuario por la cantidad de espacios que tiene
        if(nombres.length > 1){ // Si el usuario tiene mas de un espacio entonces coloca la primer letra de las primeros dos palabras del nombre
            fotoUsuario.textContent = nombres[0][0].toUpperCase() + nombres[1][0].toUpperCase()
        }else{ 
            // Si solo tiene una palabra como nombre, muestra las primeras dos letras de esa palabra
            fotoUsuario.textContent = nombres[0].slice(0, 2).toUpperCase()      
        }
    }
    nombreUsuario.textContent = informacionUsuario.nombre // Coloca el nombre del usuario
    correoUsuario.textContent = informacionUsuario.correo // Coloca el correo del usuario
    idUsuario.textContent = `ID: ${informacionUsuario._id}` // Coloca el id del usuario
}




// Alternar menu del boton de "menu" responsive
const menuVentanaResponsive = document.getElementById('div-menu__div-ventana')! as HTMLUListElement;
const botonMenuResposive = document.getElementById('header-responsive__div-menu')! as HTMLDivElement;
botonMenuResposive.addEventListener('click',()=>{
    menuVentanaResponsive.classList.add('div-menu__div-ventana-active')
})

const botonMenuVolver = document.getElementById('div-menu__div-volver')! as HTMLDivElement
botonMenuVolver.addEventListener('click',(event)=>{
    menuVentanaResponsive.classList.remove('div-menu__div-ventana-active')
    event.stopPropagation() // Evita que el evento ejecute el evento del elemento padre, es decir, el evento de "botonUsuarioResponsive"
})

// Alternar "mi cuenta" del boton de cuenta responsive
const cuentaVentanaResponsive = document.getElementById('div-cuenta__div-ventana')! as HTMLDivElement;
const botonUsuarioResponsive:HTMLElement = document.getElementById('header-responsive__div-cuenta')!
botonUsuarioResponsive.addEventListener('click',()=>{
    cuentaVentanaResponsive.classList.add('div-cuenta__div-ventana-active')
})

const botonCuentaVolver = document.getElementById('div-ventana__div-volver')! as HTMLDivElement
botonCuentaVolver.addEventListener('click',(event)=>{
    cuentaVentanaResponsive.classList.remove('div-cuenta__div-ventana-active')
    event.stopPropagation() // Evita que el evento ejecute el evento del elemento padre, es decir, el evento de "botonUsuarioResponsive"
})


// Cerrar sesion
const botonCerrarSesion:HTMLElement = document.getElementById('botonUsuario__li__ul-salir')!
const botonCerrarSesionResponsive:HTMLElement = document.getElementById('ul-opciones__li-cerrarSesion')!

botonCerrarSesion.addEventListener('click',()=>{ // Escucha cuando se hace click en cerrar sesion
    localStorage.removeItem('tokenAcceso') // Elimina el token de acceso
    window.location.assign(url) // Redirije al usuario al inicio de la pagina
})
botonCerrarSesionResponsive.addEventListener('click',()=>{ // Escucha cuando se hace click en cerrar sesion
    localStorage.removeItem('tokenAcceso') // Elimina el token de acceso
    window.location.assign(url) // Redirije al usuario al inicio de la pagina
})



// Verifica que refleja busqueda actual
const inputBusqueda = document.getElementById('header__form-barraBusqueda__input')! as HTMLInputElement
const inputBusquedaResponsive = document.getElementById('header-responsive__form-barraBusqueda__input')! as HTMLInputElement
    
document.addEventListener("DOMContentLoaded", async() => { // Si se realizo una busqueda previa lo refleja en la barra de busqueda
    const urlObjeto = new URL(window.location.href); // Crea un objeto para definir, o ver, los query elements mas facilmente
    const palabraBuscada = urlObjeto.searchParams.get('palabraBuscada') // Almacena la palabra buscada previamente si existe

    // Informacion del usuario
    const informacionUsuario = await usuarioVerificado
    if(informacionUsuario) reflejarSesionActiva(informacionUsuario) // Si hay informacion del usuario entonces refleja la sesion activa


    if(palabraBuscada){ // Si la palabra buscada existe
        inputBusqueda.value = palabraBuscada // La define como valor en el input de la barra de busqueda
        inputBusquedaResponsive.value = palabraBuscada // La define como valor en el input de la barra de busqueda
        inputBusqueda.classList.add('header__form-barraBusqueda__input-active'); // La define como valor en el input de la barra de busqueda
        inputBusquedaResponsive.classList.add('header__form-barraBusqueda__input-active'); // La define como valor en el input de la barra de busqueda
    }else{
        inputBusqueda.classList.remove('header__form-barraBusqueda__input-active'); // La define como valor en el input de la barra de busqueda
        inputBusquedaResponsive.classList.remove('header__form-barraBusqueda__input-active'); // La define como valor en el input de la barra de busqueda
    }
})

// Escucha una nueva busqueda

const formularioBusqueda = document.getElementById('header__form-barraBusqueda')! as HTMLFormElement
const formularioBusquedaResponsive = document.getElementById('header-responsive__form-barraBusqueda')! as HTMLFormElement

// Escucha si las barras de busqueda son ejecutadas
formularioBusqueda.onsubmit = (event)=>{
    event.preventDefault()
    location.assign(`/catalogo?palabraBuscada=${inputBusqueda.value}`) // Redirije al usuario a la pagina del catalogo con la plabra buscada como parametro de busqueda
}
formularioBusquedaResponsive.addEventListener('submit', (event)=>{ // Escucha cuando se envia el formulario, es decir, cuando se realiza una busqueda
    event.preventDefault()
    location.assign(`/catalogo?palabraBuscada=${inputBusquedaResponsive.value}`) // Redirije al usuario a la pagina del catalogo con la plabra buscada como parametro de busqueda
})

export { url, usuarioVerificado };
