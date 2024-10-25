import { producto } from "../../models/interfaces/producto.js";
import { tokenAcceso } from "./global.js";
import { url } from "./header.js";
import { agregarProductosDOM } from "./helpers/agregarProductosDOM.js";
import { mostrarMensaje } from "./helpers/mostrarMensaje.js";



// Busca los productos que tiene el usuario en la lista de deseados
const iconoCarga = document.getElementById('cargandoProductos')! // Selecciona el icono de carga
iconoCarga.classList.add('active') // Activa el icono de carga

const contenedorProductos = document.getElementById('contenedorProductos')!; // Selecciona el contenedor de productos

fetch(url+`/api/usuarios/listaDeseados?productoCompleto=true`,{ 
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
        'tokenAcceso':`${tokenAcceso}` // Envia el token de acceso del usuario
    },
    })
    .then(response => response.json()) // Parsea la respuesta 
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error.msg)})
        }else{ // Si no hay errores:
            const productos:[producto] = data
            if(productos[0]){ // Si el servidor devuelve al menos un producto de la lista de deseados

                iconoCarga.classList.remove('active') // Desactiva el icono de carga
                agregarProductosDOM(productos,contenedorProductos) // Agrega el o los productos al DOM

            }else{ // Si no se encontraron productos da aviso al usuario
                // Vacia el contenedor y muestra un mensaje de error
                iconoCarga.classList.remove('active') // Activa el icono de carga
                contenedorProductos.innerHTML=`
                <div id="mensajeSinProductos">
                    <div class="mensajeSinProductos__mensaje">Vacio</div>
                    <div class="mensajeSinProductos__mensaje">Agrega elementos para verlos aqui</div>
                </div>
                `
        }
    }
})
.catch(error=>{
    mostrarMensaje('2',true);
    console.error(error)
})