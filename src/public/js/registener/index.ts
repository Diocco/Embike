
import { ObjectId } from "mongoose"
import { CategoriaI } from "../../../models/interfaces/categorias.js"
import { producto } from "../../../models/interfaces/producto.js"
import { buscarCargarCategorias } from "../helpers/categorias.js"
import { actualizarProducto, obtenerProductos, solicitudEliminarProducto } from "../services/productosAPI.js"
import { agregarProductosDOM, alternarDisponibilidadProducto } from "./productos.js"
import { ventanaEmergenteModificarProducto } from "./ventanasEmergentes/modificarProducto.js"
import { preguntar } from "./ventanasEmergentes/preguntar.js"
import { mostrarMensaje } from "../helpers/mostrarMensaje.js"
import { variante } from "../../../models/interfaces/variante.js"
import { actualizarVariante } from "../services/variantesAPI.js"
import { url, usuarioVerificado } from "../global.js"
import { usuario } from "../../../models/interfaces/usuario.js"
import { cargarVentaPublico } from "./ventaPublico.js"





//Variables globales
const contenedorProductos: HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__productos')!
export let productos:producto[]

export let categorias:CategoriaI[]|undefined
export let usuarioInformacion:usuario|undefined

export const buscarCargarProductos =async()=>{ 
    // Define los query params para enviarlos en el fetch y asi filtrar los productos
    const params = new URLSearchParams(window.location.search);
    const desde = params.get('desde') || '0';
    const hasta = params.get('hasta') || '20';
    const precioMin = params.get('precioMin') || '';
    const precioMax = params.get('precioMax') || '';
    const palabraBuscada = params.get('palabraBuscada') || '';
    const categorias = params.get('categorias') || '';
    const ordenar = params.get('ordenar') || '';

    const respuesta = await obtenerProductos(desde,hasta,precioMin,precioMax,palabraBuscada,categorias,ordenar),
    productos = respuesta.productos


    await agregarProductosDOM(productos,contenedorProductos) // Si se encuentran productos para los parametros de busqueda entonces los agrega
    botonesSeccionProductos(productos) // Le da la funcion a los botones de cada producto
}

//Carga la seccion de seleccion de productos, se ejecuta cada vez que se hace click sobre la barra lateral para desplazarse a este mismo
function botonesSeccionProductos(productos:producto[]) {
    const botonAgregarProductos = document.getElementById('contenedorConfiguracionProductos__contenido__agregarProducto')! as HTMLButtonElement
    botonAgregarProductos.onclick=(event)=>{
        event.stopPropagation()
        ventanaEmergenteModificarProducto() // Abre la ventana emergente para modificar un producto, al no pasarle ningun ID la funcion crea un producto nuevo.
    }
    // Le da la funcion a los botones de alternar disponibilidad de un producto
    const botonesDisponibilidad: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.producto__disponibilidad')
    botonesDisponibilidad.forEach((boton)=>{
        boton.onclick =(event)=>{
            event.stopPropagation()
            const idProducto = boton.parentElement!.parentElement!.id!
            const estaDisponible = boton.classList.contains('botonPositivo')
            alternarDisponibilidadProducto(idProducto,estaDisponible,boton)
        }
    })

    // Le da la funcion a los botones de modificar un producto
    const productosDOM: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.productos__div')
    productosDOM.forEach((productoDOM)=>{
        productoDOM.onclick =(event)=>{
            event.stopPropagation()
            const idProducto = productoDOM.id! // Obtiene el id del producto que se desea modificar
            const productoInformacion = productos.find(producto => producto._id.toString() === idProducto)! // Busca el id en el array de productos previamente buscado
            ventanaEmergenteModificarProducto(productoInformacion) // Envia la informacion del producto a la ventana emergente para modificar el producto
        }
    })

    // Le da la funcion a los botones de eliminar un producto
    const botonesEliminar: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.producto__eliminar')
    botonesEliminar.forEach((boton)=>{
        boton.onclick =async(event)=>{
            event.stopPropagation()
            const idProducto = boton.parentElement!.parentElement!.id!
            const respuesta:boolean = await preguntar('¿Estas seguro que quieres eliminar este producto?')
            if(respuesta) {
                const productoEliminado = await solicitudEliminarProducto(idProducto)
                if(productoEliminado) buscarCargarProductos() // Si el servidor no devuelve errores vuelve a cargar los productos            
            }
        }
    })
}





const cargarBotonesBarraLateral=()=>{
    //Carga y le da funciones a la barra lateral
    const configuracionProductosVentana = document.getElementById("contenedorConfiguracionProductos")!
    const seleccionProductosVentana = document.getElementById("seleccionProductos")!
    const cobroVentana = document.getElementById("seccionCobro")!
    const ventanas = document.querySelectorAll('.contenedorRegistener1')

    document.getElementById("barraLateral_A__icono")!.addEventListener("click",()=>{
        ventanas.forEach(contenedor=>contenedor.classList.add('noActivo')) // Esconde todos las secciones
        configuracionProductosVentana.classList.remove('noActivo')
        configuracionProductosVentana.scrollIntoView(({block: 'center' }));
    });
    document.getElementById("barraLateral_B__icono")!.addEventListener("click",()=>{
        ventanas.forEach(contenedor=>contenedor.classList.add('noActivo')) // Esconde todos las secciones
        seleccionProductosVentana.classList.remove('noActivo')
        seleccionProductosVentana.scrollIntoView(({block: 'center' }));
        cargarVentaPublico()
    });
    document.getElementById("barraLateral_C__icono")!.addEventListener("click",()=>{
        ventanas.forEach(contenedor=>contenedor.classList.add('noActivo')) // Esconde todos las secciones
        cobroVentana.classList.remove('noActivo')
        cobroVentana.scrollIntoView(({block: 'center' }));
    });
}








document.addEventListener("DOMContentLoaded", async function() {

    // Busca y carga los productos en el contenedor pasado como argumento
    const contenedorCategorias:HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__categorias')!
    const contenedorOpcionesCategorias = document.getElementById('modificarProducto__caracteristicas__select__categoria')! as HTMLSelectElement
    



    [usuarioInformacion,,categorias] = await Promise.all([
        usuarioVerificado,
        buscarCargarProductos(), // Busca y carga los productos
        buscarCargarCategorias(contenedorCategorias,contenedorOpcionesCategorias), // Busca y carga las categorias
        cargarBotonesBarraLateral()
    ]);

    // Si no se inicio sesion reedirije al usuario a la pagina de inicio de sesion
    if(!usuarioInformacion) {
        localStorage.setItem('mostrarMensajeError',"Inicia sesion primero") // Define un mensaje de error para que sea mostrado al usuario una vez que carge la pagina a la que se redirige
        window.location.assign(url+'/inicioSesion') // Redirije al usuario al inicio de sesion
        return
    }
    // Si el usuario no tiene los permisos necesarios entonces lo devuelve al inicio de la pagina
    if(usuarioInformacion.rol!=='admin') {
        localStorage.setItem('mostrarMensajeError',"Usted no posee los permisos necesarios") // Define un mensaje de error para que sea mostrado al usuario una vez que carge la pagina a la que se redirige
        window.location.assign(url+'/') // Redirije al usuario al inicio de sesion
    }
    
    
    cargarVentaPublico()
});





