import { ObjectId } from "mongoose";
import { producto } from "../../../../models/interfaces/producto.js";
import { tokenAcceso, urlProductos } from "../../global.js";
import { mostrarMensaje } from "../../helpers/mostrarMensaje.js";
import { agregarImagenesDOM } from "./modificarProducto.js";
import { preguntar } from "./preguntar.js";

const contenedorVentanaModificar:HTMLElement = document.getElementById('modificarProducto')! // Ventana emergente para modificar el producto
const ventanaImagenVariante:HTMLElement = document.getElementById('imagenVariantesProducto')! // Ventana emergente para modificar o visualizar una imagen del producto

const contenedorImagen = document.getElementById('imagenVariantesProducto__img')! as HTMLImageElement; // Contenedor de la imagen del producto
const cargarImagenInput = document.getElementById('imagenVariantesProducto__input')! as HTMLInputElement; // Input para cargar una nueva imagen para el producto
const botonEliminarImagen = document.getElementById('producto__eliminarImagen')! // Boton para eliminar la imagen actual del producto
const reader = new FileReader(); // Crear un objeto FileReader para manejar la foto que suba el usuario
let imagenNueva:File // Variable que contiene la nueva imagen subida

const botonVolver = document.getElementById('imagenVariantesProducto__volver')! as HTMLButtonElement; // Boton para volver a la ventana de modificar producto
const botonGuardar = document.getElementById('imagenVariantesProducto__guardar')! as HTMLButtonElement; // Boton para guardar los cambios realizados y volver a la ventana de modificar producto

// Variables global para usarla entre funciones
let productoInformacionGlobal:producto 
let imagenActualURLGlobal:string // Variable global para usarla entre funciones

export const ventanaEmergenteCargarImagenProducto = (productoInformacion:producto,imagenActualURL:string='')=>{
    imagenActualURLGlobal=imagenActualURL
    productoInformacionGlobal=productoInformacion

    // Reinicia el contenedor de imagen y el input para subir imagenes
    contenedorImagen.style.backgroundImage = ``;
    cargarImagenInput.value=''

    // Si se recibe, coloca la imagen presionada en el contenedor para visualizarla
    if(imagenActualURL){
        contenedorImagen.style.backgroundImage = `url(${imagenActualURL})`; // Establece la imagen como fondo del div
    }

    // Activa la ventana emergente de agregar o visualizar imagen a la variante
    ventanaImagenVariante.classList.remove('noActivo')
    
    // Desactiva la ventana de modificar producto
    contenedorVentanaModificar.classList.add('noActivo')

    

    

    // Espera la respuesta del usuario
    new Promise<boolean>((resolve) => {
        botonGuardar.onclick=()=>resolve(true)
        botonVolver.onclick=()=>resolve(false)
    })
    .then(async(guardar)=>{
        if(guardar) {
            const productoActualizado = await agregarFotoProducto(productoInformacion._id,imagenNueva,imagenActualURL) // Envia la foto subida por el usuario (y si existe envia la imagen que va a remplazar) y recibe el producto actulizado
            await agregarImagenesDOM(productoActualizado) // Refleja los cambios en la ventana de modificar producto
        }
    })
    .then(()=>{
        // Desactiva la ventana emergente de agregar o visualizar imagen a la variante
        ventanaImagenVariante.classList.add('noActivo')
        
        // Activa la ventana de modificar producto
        contenedorVentanaModificar.classList.remove('noActivo')
    })
    .catch(error=>{
        mostrarMensaje('2',true)
        console.log(error)
    })

}
const agregarFotoProducto = async(productoID:ObjectId,imagenNueva:File|undefined,URLImagenVieja:string='')=>{

    const formData = new FormData()
    if(imagenNueva) formData.append('img',imagenNueva) // Si se envia una imagen para agregar, la agrega al FormData
    if(URLImagenVieja) formData.append('URLImagenVieja',URLImagenVieja) // Si se envia una imagen para eliminar la agrega al FormData

    return fetch(urlProductos+`/${productoID}`, {
        method: 'PUT',
        headers: { 'tokenAcceso':`${tokenAcceso}`},
        body: formData
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
            console.log(data.errors);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                mostrarMensaje(error.msg,true);
            })
        }else{ // Si el servidor devuelve un exitoso:
            return data.productoActualizado
        }
    })
    .catch(error => { // Si hay un error se manejan 
        console.error(error);
        mostrarMensaje('2',true);
        return -1
    })
    .finally(()=>{
        return 0
    })
}

document.addEventListener('DOMContentLoaded',()=>{
    // Escucha si el usuario presiona el boton de eliminar imagen
    botonEliminarImagen.onclick=async()=>{
        ventanaImagenVariante.classList.add('noActivo') // Desactiva la ventana emergente de agregar o visualizar imagen a la variante
        const respuesta:boolean = await preguntar('¿Estas seguro que desea eliminar la imagen?')
        ventanaImagenVariante.classList.remove('noActivo') // Activa la ventana emergente de agregar o visualizar imagen a la variante
        if(respuesta){
            // Si el usuario confirma que quiere eliminar la foto entonces llama a la funcion para agregar una foto de perfil, pero no le envia ninguna foto y solo envia el URL que debe eliminar del servidor
            const productoActualizado = await agregarFotoProducto(productoInformacionGlobal._id,undefined,imagenActualURLGlobal) // Envia la foto subida por el usuario (y si existe envia la imagen que va a remplazar) y recibe el producto actulizado
            await agregarImagenesDOM(productoActualizado) // Refleja los cambios en la ventana de modificar producto
            ventanaImagenVariante.classList.add('noActivo') // Desactiva la ventana emergente de agregar o visualizar imagen a la variante
            contenedorVentanaModificar.classList.remove('noActivo') // Activa la ventana emergente de agregar o visualizar imagen a la variante
        }
    }

    // Escucha si el usuario carga una nueva imagen
    cargarImagenInput.addEventListener('change', () => {
        try {
            if(cargarImagenInput.files){ // Si hay un archivo cargado 
                imagenNueva = cargarImagenInput.files[0]; // Obtener el primer archivo
    
                reader.onload = (e) => {
                    contenedorImagen.style.backgroundImage = `url(${e.target!.result})`; // Establece la imagen como fondo del div
                };
        
                reader.readAsDataURL(imagenNueva); // Leer el archivo como URL de datos
            }
        } catch (error) {
            mostrarMensaje('Hubo un error al cargar la imagen',true)
            console.log(error)
        }
        
    })
})