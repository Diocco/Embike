import { producto, variante } from "../../../../models/interfaces/producto.js";
import { categoria } from "../../../../models/interfaces/categorias.js";
import { tokenAcceso, urlProductos } from "../../global.js";
import { mostrarMensaje } from "../../helpers/mostrarMensaje.js";
import { ventanaEmergenteModificarVarianteProducto } from "./modificarVariante.js";
import { agregarCategoria } from "../../helpers/categorias.js";
import { actualizarProducto, buscarProductos } from "../productos.js";
import { preguntar } from "./preguntar.js";

// Contenedores de la ventana emergente
const contenedorVentanaEmergente:HTMLElement = document.getElementById('ventanaEmergenteFondo')!
const ventanaEmergente:HTMLElement = document.getElementById('modificarProducto')!

// Input en donde el usuario agregara las diferentes caracteristicas del producto
let nombre = document.getElementById("modificarProducto__caracteristicas__input__nombre")! as HTMLInputElement ;
let precio = document.getElementById("modificarProducto__caracteristicas__input__precio")! as HTMLInputElement;
let marca = document.getElementById("modificarProducto__caracteristicas__input__marca")! as HTMLInputElement;
let modelo = document.getElementById("modificarProducto__caracteristicas__input__modelo")! as HTMLInputElement;
let categoria = document.getElementById("modificarProducto__caracteristicas__select__categoria")! as HTMLSelectElement;
let categoriaIngresada = document.getElementById("modificarProducto__caracteristicas__input__categoria")! as HTMLInputElement;
let descripcion = document.getElementById("modificarProducto__fotoDescripcion__textarea")! as HTMLTextAreaElement;

// Botones
let aceptar:HTMLElement = document.getElementById("modificarProducto__aceptarRechazar__aceptar")!;
let rechazar:HTMLElement = document.getElementById("modificarProducto__aceptarRechazar__rechazar")!;
let verVariantes:HTMLElement = document.getElementById('modificarProducto__verVariantes')!;

// Variable que almacena la informacion del producto si todo sale bien
let productoInformacion:producto // Almacena el producto devuelto por el servidor







// Ventana emergente para modificar o agregar un producto de la base de datos
export const ventanaEmergenteModificarProducto = async(productoID:string='') =>{
    // Activa la ventana emergente
    contenedorVentanaEmergente.classList.remove('noActivo')
    ventanaEmergente.classList.remove('noActivo')

    //Les da un valor inicial, borrando cualquier valor viejo que tenga
    nombre.value="";
    precio.value="";
    marca.value="";
    modelo.value="";
    categoriaIngresada.value=''
    descripcion.textContent=''

    if((productoID)){ // Si a la funcion se le paso un ID de un producto entonces la funcion es para modificarlo un producto

        productoInformacion = await buscarProducto(productoID);
        cargarProductoDOM()
    }   


}
const agregarImagenesDOM = async(productoInformacion:producto)=>{
    // Imagen principal
    let imagen = document.getElementById("modificarProducto__fotoDescripcion__img")! as HTMLImageElement;
    imagen.style.backgroundImage=''
    imagen.style.backgroundImage = `url('${productoInformacion.imagenes[0]}')`;

    // Contenedor de las imagenes de la variante
    const contenedorImagenes= document.getElementById('modificarProducto__caracteristicas__div-imagenes')!
    contenedorImagenes.innerHTML='' // Vacia el contenedor de imagenes

    let contadorImagenes:number=1
    // Agregar elementos que representan a las imagenes del producto
    productoInformacion.imagenes.forEach(imagenURL =>{ // Agrega las imagenes a la variante
        contenedorImagenes.innerHTML=contenedorImagenes.innerHTML+`<div id="${imagenURL}" class="caracteristicas__imagen">${contadorImagenes}</div>`
        contadorImagenes++
    })
    // Luego de los elementos agrega un elemento mas para agregar una nueva imagen
    contenedorImagenes.innerHTML=contenedorImagenes.innerHTML+`<button class="botonRegistener2" id="caracteristicas__agregarImagen">+</button>`
    
    // Le da la funcion a los botones de las imagenes de las variantes
    const botonesVerImagen = document.querySelectorAll('.caracteristicas__imagen') as NodeListOf<HTMLDivElement>
    botonesVerImagen.forEach((botonVerImagen)=>{
        botonVerImagen.addEventListener('click',(event)=>{
            event.preventDefault()
            // Envia a la funcion el URL de la imagen presionada
            const imagenActualURL:string = botonVerImagen.id
            ventanaEmergenteCargarImagenProducto(productoInformacion,imagenActualURL)
        })
    })

    // Le da la funcion al boton de agregar imagenes al producto
    const botonAgregarImagen = document.getElementById('caracteristicas__agregarImagen')!
    botonAgregarImagen.addEventListener('click',(event)=>{
        event.preventDefault()
        ventanaEmergenteCargarImagenProducto(productoInformacion)
    })
}
const ventanaEmergenteCargarImagenProducto = (productoInformacion:producto,imagenActualURL:string='')=>{
    const contenedorImagen = document.getElementById('imagenVariantesProducto__img')! as HTMLImageElement;
    const cargarImagenInput = document.getElementById('imagenVariantesProducto__input')! as HTMLInputElement;


    // Reinicia el contenedor de imagen y el input para subir imagenes
    contenedorImagen.style.backgroundImage = ``;
    cargarImagenInput.value=''

    // Si se recibe, coloca la imagen presionada en el contenedor para visualizarla
    if(imagenActualURL){
        contenedorImagen.style.backgroundImage = `url(${imagenActualURL})`; // Establece la imagen como fondo del div
    }

    // Activa la ventana emergente de agregar o visualizar imagen a la variante
    const ventanaImagenVariante:HTMLElement = document.getElementById('imagenVariantesProducto')!
    ventanaImagenVariante.classList.remove('noActivo')
    
    // Desactiva la ventana de modificar producto
    const contenedorVentanaModificar:HTMLElement = document.getElementById('modificarProducto')!
    contenedorVentanaModificar.classList.add('noActivo')

    // Escucha si el usuario presiona el boton de eliminar imagen
    const botonEliminarImagen = document.getElementById('producto__eliminarImagen')!
    botonEliminarImagen.onclick=async()=>{
        ventanaImagenVariante.classList.add('noActivo') // Desactiva la ventana emergente de agregar o visualizar imagen a la variante
        const respuesta:boolean = await preguntar('¿Estas seguro que desea eliminar la imagen?')
        ventanaImagenVariante.classList.remove('noActivo') // Activa la ventana emergente de agregar o visualizar imagen a la variante
    if(respuesta){
        // Si el usuario confirma que quiere eliminar la foto entonces llama a la funcion para agregar una foto de perfil, pero no le envia ninguna foto y solo envia el URL que debe eliminar del servidor
        const productoActualizado = await agregarFotoProducto(productoInformacion._id,undefined,imagenActualURL) // Envia la foto subida por el usuario (y si existe envia la imagen que va a remplazar) y recibe el producto actulizado
        await agregarImagenesDOM(productoActualizado) // Refleja los cambios en la ventana de modificar producto
        ventanaImagenVariante.classList.add('noActivo') // Desactiva la ventana emergente de agregar o visualizar imagen a la variante
        contenedorVentanaModificar.classList.remove('noActivo') // Activa la ventana emergente de agregar o visualizar imagen a la variante
    }
    }

    // Escucha si el usuario carga una nueva imagen
    let imagenNueva:File
    cargarImagenInput.addEventListener('change', () => {
        try {
            if(cargarImagenInput.files){ // Si hay un archivo cargado 
                const imagenNueva = cargarImagenInput.files[0]; // Obtener el primer archivo
    
                const reader = new FileReader(); // Crear un objeto FileReader
    
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

    // Espera la respuesta del usuario
    new Promise<boolean>((resolve, reject) => {
        const botonVolver = document.getElementById('imagenVariantesProducto__volver')! as HTMLButtonElement;
        const botonGuardar = document.getElementById('imagenVariantesProducto__guardar')! as HTMLButtonElement;
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
        const ventanaImagenVariante:HTMLElement = document.getElementById('imagenVariantesProducto')!
        ventanaImagenVariante.classList.add('noActivo')
        
        // Activa la ventana de modificar variante de producto
        const contenedorVentanaVariantes:HTMLElement = document.getElementById('modificarProducto')!
        contenedorVentanaVariantes.classList.remove('noActivo')
    })
    .catch(error=>{
        mostrarMensaje('2',true)
        console.log(error)
    })

}
const agregarFotoProducto = async(productoID:string,imagenNueva:File|undefined,URLImagenVieja:string='')=>{

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
        console.log(data)
        if(data.errors){ // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
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
const buscarProducto = async(productoID:string) =>{

    return new Promise<producto>((resolve) => {
        // Busca el producto en la base de datos
        fetch(urlProductos + `/${productoID}`, {
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
            resolve(data) // Almacena el producto devuelto por el servidor
        }
        })
        .catch(error => { // Si hay un error se manejan 
            mostrarMensaje('2',true);
            console.error(error);
        })
        
    })
}
const cargarProductoDOM =()=>{
    // Coloca la informacion en los inputs correspondientes
    nombre.value = productoInformacion.nombre;
    precio.value = `${productoInformacion.precio}`;
    marca.value = `${productoInformacion.marca}`;
    modelo.value = productoInformacion.modelo;
    categoria.value = (productoInformacion.categoria as categoria).nombre;
    descripcion.textContent = productoInformacion.descripcion;

    // Carga las imagenes del producto en el DOM
    agregarImagenesDOM(productoInformacion);
}


document.addEventListener('DOMContentLoaded',()=>{
    // Define las funciones de los botones
    verVariantes.addEventListener('click',async(event)=>{
        event.preventDefault()
        const esVariantes = await ventanaEmergenteModificarVarianteProducto(productoInformacion) // Abre la ventana emergente de las variantes del producto, devuelve un array de variantes o undefined
        if(esVariantes) productoInformacion.variantes = esVariantes // Si la funcion devolvio un array de variantes entonces las almacena
        console.log(productoInformacion.variantes)
    })

    // Boton para guardar los cambios
    aceptar.onclick=():void=>{ 

        if(productoInformacion._id){ // Si a la funcion se le paso un ID de un producto entonces la funcion es para modificarlo

            const formularioProducto = document.getElementById('modificarProducto__caracteristicas')! as HTMLFormElement
            const datosFormulario = new FormData(formularioProducto)


            // Si el usuario ingreso una nueva categoria entonces la crea en la base de datos y en el formulario
            new Promise<void>(async(resolve) => {
                if(categoriaIngresada.value){
                    datosFormulario.set('categoria',categoriaIngresada.value)
                    await agregarCategoria(categoriaIngresada.value)
                    resolve()
                }
                resolve()
            })
            .then(async()=>{
                await actualizarProducto(datosFormulario,productoInformacion._id,productoInformacion.variantes);
            })
            .then(()=>{
                mostrarMensaje('5') 
                const contenedorProductos: HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__productos')!
                buscarProductos(contenedorProductos);
            })

        }else{ //Si la funcion es para agregar producto entonces...
            // productoNuevo={
            //     foto: ``,
            //     nombre: `${nombre.value}`,
            //     id: `${id.value}`,
            //     precio: Number(precio.value),
            //     stock: Number(stock.value),
            //     tipo: `${tipo.value}`,
            //     categoria: `${categoria.value}`,
            //     color:color.value,
            //     codigoBarra: Number(codigoBarra.value),
            //     promocionable: `${promocionable.value}`,
            //     descripcion: `${descripcion.value}`,
            //     orden: 0,
            //     seleccionado: "true"
            // }

            // let peticionModificar: IDBRequest = db.transaction([`productos`],`readwrite`).objectStore(`productos`).put(productoNuevo); // Remplaza el producto en la base de datos o lo crea si no existe
            // peticionModificar.onsuccess=()=>{
            //     alternarFondoVentanaEmergente();
            //     cargarproductosdb();
            //     resolve(true);
            // }
            // peticionModificar.onerror=()=>{
            //     ventanaEmergente("Error al modificar");
            // }
            
        }

        // Desactiva la ventana emergente
        contenedorVentanaEmergente.classList.add('noActivo')
        ventanaEmergente.classList.add('noActivo')


    }
    rechazar.onclick=()=>{ //Si se apreta rechazar no se guardan los datos cambiados
        // Desactiva la ventana emergente
        contenedorVentanaEmergente.classList.add('noActivo')
        ventanaEmergente.classList.add('noActivo')
    }
})