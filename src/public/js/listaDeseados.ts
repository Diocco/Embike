import { agregarProductosDOM } from "./helpers/agregarProductosDOM.js";

// Define el entorno
let url:string
const esDesarollo:Boolean = window.location.hostname.includes('localhost'); // Revisa el url actual

if(esDesarollo){ // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
    url = 'http://localhost:8080';
}else{ // Si no tiene localhost define el url en la pagina web para la peticion
    url= 'https://embike-223a165b4ff6.herokuapp.com';
}

// Busca los productos que tiene el usuario en la lista de deseados
const iconoCarga = document.getElementById('cargandoProductos')! // Selecciona el icono de carga
iconoCarga.classList.add('active') // Activa el icono de carga

const contenedorProductos = document.getElementById('contenedorProductos')!; // Selecciona el contenedor de productos

fetch(url+`/api/usuarios/listaDeseados?productoCompleto=true`,{ 
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
        'tokenAcceso':`${localStorage.getItem('tokenAcceso')}` // Envia el token de acceso del usuario
    },
    })
    .then(response => response.json()) // Parsea la respuesta 
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error.msg)})
        }else{ // Si no hay errores:
            if(data[0]){ // Si el servidor devuelve al menos un producto de la lista de deseados

                iconoCarga.classList.remove('active') // Desactiva el icono de carga
                agregarProductosDOM(data,contenedorProductos) // Agrega el o los productos al DOM

            }else{ // Si no se encontraron productos da aviso al usuario
                // Vacia el contenedor y muestra un mensaje de error
                contenedorProductos.innerHTML=`
                <div id="mensajeSinProductos">
                    <div class="mensajeSinProductos__mensaje">Vacio</div>
                    <div class="mensajeSinProductos__mensaje">Agrega elementos para verlos aqui</div>
                </div>
                `
        }
    }
})