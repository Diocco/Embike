import { producto } from "../../models/interfaces/producto.js";
import { agregarProductosDOM } from "./helpers/agregarProductosDOM.js";
import { mostrarMensaje } from "./helpers/mostrarMensaje.js";
import { obtenerListaDeseados } from "./services/usuariosAPI.js";



// Busca los productos que tiene el usuario en la lista de deseados
const iconoCarga = document.getElementById('cargandoProductos')! // Selecciona el icono de carga
iconoCarga.classList.add('active') // Activa el icono de carga

const contenedorProductos = document.getElementById('contenedorProductos')!; // Selecciona el contenedor de productos

const respuesta = await obtenerListaDeseados()
if(respuesta.errors.length>0){ // Si el servidor devuelve errores los muestra segun corresponda
    mostrarMensaje('',true);
    respuesta.errors.forEach(error => console.log(error.msg)) // Recorre los errores
    
}else if (respuesta.productos as producto[]){ // Si no hay errores:
    if(respuesta.productos.length>0){ // Si el servidor devuelve al menos un producto de la lista de deseados
        iconoCarga.classList.remove('active') // Desactiva el icono de carga
        agregarProductosDOM(respuesta.productos as producto[],contenedorProductos) // Agrega el o los productos al DOM

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
