
import { producto } from "../../../models/interfaces/producto.js";
import { variante } from "../../../models/interfaces/variante.js";
import { tokenAcceso, urlProductos } from "../global.js";
import { mostrarMensaje } from "../helpers/mostrarMensaje.js";
import { buscarCargarProductos } from "./index.js";




export const agregarProductosDOM = async(productos:producto[],contenedorProductos:HTMLElement) => {


    if(productos.length<0){ // Si no se encontraron productos da aviso al usuario
        // Vacia el contenedor y muestra un mensaje de error
        contenedorProductos.innerHTML=`
        <div id="mensajeSinProductos">
            <i id="mensajeSinProductos__logo" class="fa-solid fa-triangle-exclamation"></i>
            <p id="mensajeSinProductos__mensaje" >No se encontraron productos para los parametros de busqueda</p>
        </div>
        `
        return 
    }

    new Promise<void>((resolve) => {
        contenedorProductos.innerHTML=''; // Reinicia el contenedor
        const fragmento: DocumentFragment = document.createDocumentFragment(); //Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo
    

        productos.forEach((producto) => { // Recorre los productos
            let agregarElemento = document.createElement('div'); // Crea un div para alojar el nuevo producto

            // Calcula el stock total del producto
            let stockTotal:number=0;
            if(producto.variantes){
                (producto.variantes as variante[]).forEach(variante => {
                    stockTotal=stockTotal+variante.stock
                })
            }else{
                mostrarMensaje('No se pudo calcular el stock de un producto',true)
                console.error(`No se pudo calcular el stock del producto: ${producto.nombre}, ya que no tiene ninguna variante, por favor asignarle una`  )
            }
            
            agregarElemento.id=producto._id.toString()
            agregarElemento.classList.add("productos__div")
            
            let claseProductoDisponible = 'botonPositivo'
            if (producto.disponible===false) claseProductoDisponible='' // Si el producto no esta disponible entonces no coloca ninguna clase

            agregarElemento.innerHTML=` 
            <div class="producto__div__nombre">${producto.nombre}</div>
            <div class="producto__div__precio">${(Number(producto.precio)).toLocaleString('es-AR')}</div>
            <div class="producto__div__stock">${stockTotal}</div>
            <div class="producto__div__opciones">
                <button class="fa-solid fa-check     producto__opciones botonRegistener3 producto__disponibilidad ${claseProductoDisponible}" ></button>
                <button class="fa-solid fa-trash-can producto__opciones botonRegistener3 producto__eliminar       botonNegativo             " ></button>
            </div>
            `
            
            fragmento.appendChild(agregarElemento); //Agrega el producto recien creado al fragmento
    
        })
        contenedorProductos.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo
        resolve()
    })

}




export function eliminarProducto(idProducto: string) {
    fetch(urlProductos+`/${idProducto}`, { 
        method: 'DELETE',
        headers: {  'Content-Type': 'application/json' ,
                    'tokenAcceso' : `${tokenAcceso}`  },
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            buscarCargarProductos()
        }
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true);
        console.error(error);
    })
}


export const alternarDisponibilidadProducto =(idProducto:string,estaDisponible:boolean,boton:HTMLElement)=>{
    // Realiza la peticion PUT para modificar el producto
    const data={
        disponible:!estaDisponible // Envia el opuesto a la disponibilidad actual del producto
    }

    fetch(urlProductos+`/${idProducto}`, { 
        method: 'PUT',
        headers: {  'Content-Type': 'application/json' ,
                    'tokenAcceso' : `${tokenAcceso}`  },
        body: JSON.stringify(data)
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            console.log(data)
            boton.classList.toggle('botonPositivo') // Alterna visualmente la disponibilidad del producto para reflejar los cambios efectuados
        }
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true);
        console.error(error);
    })
}




