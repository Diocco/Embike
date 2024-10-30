
import { producto } from "../../../models/interfaces/producto.js";
import { tokenAcceso, urlProductos } from "../global.js";
import { mostrarMensaje } from "../helpers/mostrarMensaje.js";
import { variante } from '../../../models/interfaces/producto.js';
import { ventanaEmergenteModificarProducto } from "./ventanasEmergentes/modificarProducto.js";

export const agregarProductosDOM = (productos:[producto],contenedorProductos:HTMLElement) => {

    new Promise<void>((resolve) => {
        contenedorProductos.innerHTML=''; // Reinicia el contenedor
        const fragmento: DocumentFragment = document.createDocumentFragment(); //Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo
    

        productos.forEach((producto) => { // Recorre los productos
            let agregarElemento = document.createElement('div'); // Crea un div para alojar el nuevo producto

            // Calcula el stock total del producto
            let stockTotal:number=0
            producto.variantes.forEach((variante) => {
                variante.caracteristicas.forEach(caracteristicas=>
                    stockTotal=stockTotal+caracteristicas.stock
                );
            })
            
            agregarElemento.id=producto._id
            agregarElemento.classList.add("productos__div")
            
            let claseProductoDisponible = 'botonPositivo'
            if (producto.disponible===false) claseProductoDisponible='' // Si el producto no esta disponible entonces no coloca ninguna clase

            agregarElemento.innerHTML=` 
            <div class="producto__div__nombre">${producto.nombre}</div>
            <div class="producto__div__precio">${(Number(producto.precio)).toLocaleString('es-AR')}</div>
            <div class="producto__div__stock">${stockTotal}</div>
            <div class="producto__div__opciones">
                <i class="fa-solid fa-check     producto__opciones botonRegistener3 producto__disponibilidad ${claseProductoDisponible}" ></i>
                <i class="fa-solid fa-pencil    producto__opciones botonRegistener3 producto__modificar                                " ></i>
                <i class="fa-solid fa-trash-can producto__opciones botonRegistener3 producto__eliminar       botonNegativo             " ></i>
            </div>
            `
            
            fragmento.appendChild(agregarElemento); //Agrega el producto recien creado al fragmento
    
        })
        contenedorProductos.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo
        resolve()
    })
    .then(()=>{
        botonesConfiguracionProducto() // Le asigna las funciones correspondientes a los botones de configuracion de cada producto
    })
}

export const buscarProductos = async(contenedorProductos:HTMLElement)=>{
    // Vacia el contenedor de productos y coloca una barra de carga

    contenedorProductos.innerHTML=`<div id="cargandoProductos"></div>` // Muestra el icono de carga 
    //contenedorProductos.classList.add('catalogo-conMensaje') // Centra el icono de carga
    
    // Define los query params para enviarlos en el fetch y asi filtrar los productos
    const params = new URLSearchParams(window.location.search);
    const desde = params.get('desde') || 0;
    const hasta = params.get('hasta') || 20;
    const precioMin = params.get('precioMin') || '';
    const precioMax = params.get('precioMax') || '';
    const palabraBuscada = params.get('palabraBuscada') || '';
    const categorias = params.get('categorias') || '';
    const ordenar = params.get('ordenar') || '';


    // Realiza la peticion GET para obtener los productos

    fetch(urlProductos+`?disponible=true&desde=${desde}&hasta=${hasta}&precioMin=${precioMin}&precioMax=${precioMax}&palabraBuscada=${palabraBuscada}&categorias=${categorias}&ordenar=${ordenar}`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            const productos:[producto]=data.productos
            if(productos[0]){ // Si se encuentran productos para los parametros de busqueda entonces los agrega
                contenedorProductos.classList.remove('catalogo-conMensaje')
                agregarProductosDOM(productos,contenedorProductos)
            }else{ // Si no se encontraron productos da aviso al usuario
                // Vacia el contenedor y muestra un mensaje de error
                contenedorProductos.innerHTML=`
                <div id="mensajeSinProductos">
                    <i id="mensajeSinProductos__logo" class="fa-solid fa-triangle-exclamation"></i>
                    <p id="mensajeSinProductos__mensaje" >No se encontraron productos para los parametros de busqueda</p>
                </div>
                `
            }
        }
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true);
        console.error(error);
    })
}

const botonesConfiguracionProducto =()=>{
    // Le da la funcion a los botones de alternar disponibilidad de un producto
    const botonesDisponibilidad: NodeListOf<HTMLDivElement> = document.querySelectorAll('.producto__disponibilidad')
    botonesDisponibilidad.forEach((boton)=>{
        boton.onclick =()=>{
            const idProducto = boton.parentElement!.parentElement!.id!
            const estaDisponible = boton.classList.contains('botonPositivo')
            alternarDisponibilidadProducto(idProducto,estaDisponible,boton)
        }
    })

    // Le da la funcion a los botones de modificar un producto
    const botonesModificar: NodeListOf<HTMLDivElement> = document.querySelectorAll('.producto__modificar')
    botonesModificar.forEach((boton)=>{
        boton.onclick =()=>{
            const idProducto = boton.parentElement!.parentElement!.id!
            ventanaEmergenteModificarProducto(idProducto)
        }
    })




}

const alternarDisponibilidadProducto =(idProducto:string,estaDisponible:boolean,boton:HTMLElement)=>{
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

export const actualizarProducto= async(datosProducto:FormData,productoId:string,variantes:variante[]=[])=>{
    datosProducto.append('variantes',JSON.stringify(variantes))
    return fetch(urlProductos+`/${productoId}`, { 
        method: 'PUT',
        headers: { 'tokenAcceso': `${tokenAcceso}`},
        body:datosProducto
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            return 0
        }
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true);
        console.error(error);
    })
}