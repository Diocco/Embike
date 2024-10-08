// Define el entorno
let url:string
const esDesarollo:Boolean = window.location.hostname.includes('localhost'); // Revisa el url actual

if(esDesarollo){ // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
    url = 'http://localhost:8080';
}else{ // Si no tiene localhost define el url en la pagina web para la peticion
    url= 'https://embike-223a165b4ff6.herokuapp.com';
}



// Se definen los botones de "cuenta" o de "iniciar sesion" segun si el usuario esta o no con la sesion activa
const botonIniciarSesion:HTMLAnchorElement = document.getElementById('botonIniciarSesion')! as HTMLAnchorElement
const botonIniciarSesionResponsive:HTMLAnchorElement = document.getElementById('header-responsive__a-iniciarSesion')! as HTMLAnchorElement
const botonUsuario:HTMLElement = document.getElementById('botonUsuario')!
const botonUsuarioResponsive:HTMLElement = document.getElementById('header-responsive__div-cuenta')!

const tokenAcceso: string | null = localStorage.getItem('tokenAcceso') // Recupera el token de acceso desde el localStorage

if(tokenAcceso){ // Si el token de acceso existe entonces lo verifica
    // Verificacion

    // Si el token es valido entonces modifica la parte visual para reflejar que la sesion esta activa
    botonIniciarSesion.classList.add('noActive')
    botonIniciarSesionResponsive.classList.add('noActive')
    botonUsuario.classList.remove('noActive')
    botonUsuarioResponsive.classList.remove('noActive')


}else{ // Si no existe un token de acceso entonces no hace nada

}

// Alternar "mi cuenta" del boton de cuenta responsive
const cuentaVentanaResponsive = document.getElementById('div-cuenta__div-ventana')! as HTMLDivElement;
botonUsuarioResponsive.addEventListener('click',()=>{
    cuentaVentanaResponsive.classList.add('div-cuenta__div-ventana-active')
})
const botonVolver = document.getElementById('div-ventana__div-volver')! as HTMLDivElement
botonVolver.addEventListener('click',(event)=>{
    cuentaVentanaResponsive.classList.remove('div-cuenta__div-ventana-active')
    event.stopPropagation() // Evita que el evento ejecute el evento del elemento padre, es decir, el evento de "botonUsuarioResponsive"
})


// Cerrar sesion
const botonCerrarSesion:HTMLElement = document.getElementById('botonUsuario__lista__salir')!
const botonCerrarSesionResponsive:HTMLElement = document.getElementById('ul-opciones__li-cerrarSesion')!

botonCerrarSesion.addEventListener('click',()=>{ // Escucha cuando se hace click en cerrar sesion
    localStorage.removeItem('tokenAcceso') // Elimina el token de acceso
    window.location.assign(url) // Redirije al usuario al inicio de la pagina
})
botonCerrarSesionResponsive.addEventListener('click',()=>{ // Escucha cuando se hace click en cerrar sesion
    localStorage.removeItem('tokenAcceso') // Elimina el token de acceso
    window.location.assign(url) // Redirije al usuario al inicio de la pagina
})


// Barra de busqueda

// Verifica que refleja busqueda actual
const inputBusqueda = document.getElementById('header__form-barraBusqueda__input')! as HTMLInputElement
const inputBusquedaResponsive = document.getElementById('header-responsive__form-barraBusqueda__input')! as HTMLInputElement
    
document.addEventListener("DOMContentLoaded", () => { // Si se realizo una busqueda previa lo refleja en la barra de busqueda
    const urlObjeto = new URL(window.location.href); // Crea un objeto para definir, o ver, los query elements mas facilmente
    const palabraBuscada = urlObjeto.searchParams.get('palabraBuscada') // Almacena la palabra buscada previamente si existe

    if(palabraBuscada){ // Si la palabra buscada existe
        inputBusqueda.value = palabraBuscada // La define como valor en el input de la barra de busqueda
        inputBusquedaResponsive.value = palabraBuscada // La define como valor en el input de la barra de busqueda
    }
})

// Escucha una nueva busqueda

const formularioBusqueda = document.getElementById('header__form-barraBusqueda')! as HTMLFormElement
const formularioBusquedaResponsive = document.getElementById('header-responsive__form-barraBusqueda')! as HTMLFormElement


formularioBusqueda.addEventListener('submit', (event)=>{ // Escucha cuando se envia el formulario, es decir, cuando se realiza una busqueda
    event.preventDefault()
    const esCatalogo:Boolean = window.location.pathname.includes('/catalogo') // Verifica si se esta en el catalogo
    if(esCatalogo){
        // Define los query element 
        const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
        urlObjeto.searchParams.set('palabraBuscada', inputBusqueda.value); // Si no existe, lo crea; si existe, lo actualiza
        
        window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
        buscarProductos() // Realiza la busqueda de los productos con el nuevo filtro
    }else{
        location.assign(`/catalogo?palabraBuscada=${inputBusqueda.value}`) // Redirije al usuario a la pagina del catalogo con la plabra buscada como parametro de busqueda
    }
})

formularioBusquedaResponsive.addEventListener('submit', (event)=>{ // Escucha cuando se envia el formulario, es decir, cuando se realiza una busqueda
    event.preventDefault()
    const esCatalogo:Boolean = window.location.pathname.includes('/catalogo') // Verifica si se esta en el catalogo
    if(esCatalogo){
        // Define los query element 
        const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
        urlObjeto.searchParams.set('palabraBuscada', inputBusquedaResponsive.value); // Si no existe, lo crea; si existe, lo actualiza
        
        window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
        buscarProductos() // Realiza la busqueda de los productos con el nuevo filtro
    }else{
        location.assign(`/catalogo?palabraBuscada=${inputBusquedaResponsive.value}`) // Redirije al usuario a la pagina del catalogo con la plabra buscada como parametro de busqueda
    }
})