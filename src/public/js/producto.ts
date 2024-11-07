
import { producto } from "../../models/interfaces/producto.js"
import { variante } from "../../models/interfaces/variante.js";
import { obtenerProducto } from "./services/productosAPI.js";
import { obtenerListaDeseados, solicitudAlternarProductoDeseado } from "./services/usuariosAPI.js";


const cargarColoresTalles =(productoInformacion:producto)=>{

    // Carga los colores y talles
    const coloresUnicos: Set<string> = new Set(); // Usamos un Set para almacenar colores únicos
    const tallesUnicos: Set<string> = new Set(); // Usamos un Set para almacenar talles únicos
    (productoInformacion.variantes as variante[]).forEach(variante => {
        // Agregar el color al Set de colores únicos
        coloresUnicos.add(variante.color);
        // Cargar talless
        tallesUnicos.add(variante.talle);
    });

    // Convertir los Sets a arrays 
    const coloresArray = Array.from(coloresUnicos);
    const tallesArray = Array.from(tallesUnicos);

    // Agrega los colores al DOM, si existe almenos uno.
    if(coloresArray[0]){
        const contenedorColores = document.getElementById('catalogoProducto__colores-contenedor')!
        let fragmento = document.createDocumentFragment();
        coloresArray.forEach(color=>{
            const nuevocolor = document.createElement('div')
            nuevocolor.classList.add('opcionesProductos__opcion');
            nuevocolor.classList.add(color);
            fragmento.appendChild(nuevocolor)
        })
        contenedorColores.appendChild(fragmento)
        contenedorColores.parentElement!.classList.remove('noActivo') // Activa el contenedor
    }

    // Agrega los talles al DOM, si existe almenos uno.
    if(tallesArray[0]){
        const contenedorTalles = document.getElementById('catalogoProducto__talles-contenedor')!
        let fragmento = document.createDocumentFragment();
        tallesArray.forEach(talle=>{
            const nuevoTalle = document.createElement('div')
            nuevoTalle.textContent=talle;
            nuevoTalle.classList.add('opcionesProductos__opcion');
            fragmento.appendChild(nuevoTalle)
        })
        contenedorTalles.appendChild(fragmento)
        contenedorTalles.parentElement!.classList.remove('noActivo') // Activa el contenedor
    }
}

const verificarListaDeseados =async (productoInformacion:producto)=>{
    // Refleja si el producto esta o no en la lista de deseados

    // Manda una solicitud al servidor para saber la lista de deseados del usuario
    const respuesta = await obtenerListaDeseados(false)

    if(respuesta.errors) // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
        (respuesta.errors).forEach(error=> {console.log(error.msg)}) // Recorre los errores
    else{
        // Busca el producto actual en la lista del usuario
        const indice:number = (respuesta.productos as string[]).indexOf(productoInformacion._id.toString())
        if(indice!==-1){
            // Si se encuentra entonces lo refleja visualmente
            const botonAgregarDeseados:HTMLElement = document.getElementById("botonAgregarDeseados")!
            botonAgregarDeseados.classList.add('botonAgregarDeseados-active')
            botonAgregarDeseados.classList.add('botonAgregarDeseados-push')
        }
    }

}

const cargarInformacionProducto =(productoInformacion:producto)=>{
    cargarImagenesProducto(productoInformacion)

    // Carga el nombre del producto
    let productoNombre = document.getElementById('catalogoProducto__titulo')!
    productoNombre.textContent = productoInformacion.nombre

    // Carga el descuento del producto
    const tieneDescuento:boolean = productoInformacion.precioViejo?true:false
    if(tieneDescuento){
        const precio = (Number(productoInformacion.precio))
        const precioViejo = (Number(productoInformacion.precioViejo))
        const porcentajeDescuento = Math.floor((1-precio/precioViejo)*100)

        const contenedorPrecioViejo = document.querySelector(".descuento__precioViejo")!
        const contenedorPorcentaje = document.querySelector(".descuento__porcentaje")!

        contenedorPrecioViejo.textContent=`$ ${(Number(precioViejo)).toLocaleString('es-AR')}`
        contenedorPorcentaje.textContent=` ${Math.abs(porcentajeDescuento)}% OFF!`
    }

    // Carga el precio del producto
    let productoPrecio = document.getElementById('catalogoProducto__precio')!
    productoPrecio.textContent = `$ ${(Number(productoInformacion.precio)).toLocaleString('es-AR')}` // Coloca el precio del producto con formato precio

    // Carga la descripcion del producto
    let descripcionProducto = document.getElementById('contenedorDescripcion__p')!
    descripcionProducto.textContent = productoInformacion.descripcion

    // Carga las especificaciones del producto
    let contenedorespEspecificaciones = document.getElementById('informacionGeneralProducto__div-especificaciones')!
    let especificacionesProducto = Object.entries(productoInformacion.especificaciones)
    especificacionesProducto.forEach(especificacion =>{
        const especificacionNombre = especificacion[0];
        const especificacionValor = especificacion[1];
        const HTMLProducto:string = `<h4 class="div-especificaciones__h4">${especificacionNombre}</h4>
                                    <p class="div-especificaciones__p">${especificacionValor}</p>`
        contenedorespEspecificaciones.innerHTML = contenedorespEspecificaciones.innerHTML + HTMLProducto

    })
}

const cargarImagenesProducto=(productoInformacion:producto)=>{
    // Carga la imagen principal del producto
    const productoImagen = document.getElementById('catalogoProducto__imagen')!
    let imagenPrincipal:String = productoInformacion.imagenes[0]
    productoImagen.style.backgroundImage=`url(${imagenPrincipal})`;

    // Carga la lista de imagenes
    const listaImagenes = document.getElementById('catalogoProducto__listaImagenes')!
    const fragmento = document.createDocumentFragment()
    productoInformacion.imagenes.forEach((imagen)=>{
        const nuevaImagen = document.createElement('img')
        nuevaImagen.classList.add('catalogoProducto__listaImagenes__img')
        nuevaImagen.id=imagen
        nuevaImagen.style.backgroundImage=`url(${imagen})`
        fragmento.appendChild(nuevaImagen)
    })
    listaImagenes.appendChild(fragmento)

    // Les asigna una funcion a las imagenes creadas

    const imagenesDOM = listaImagenes.querySelectorAll('.catalogoProducto__listaImagenes__img') as NodeListOf<HTMLImageElement>
    imagenesDOM.forEach((imagenDOM)=>{
        imagenDOM.onclick=()=>{ // Si se apreta una imagen de la lista de imagenes, la imagen presionada se colocara como imagen principal del producto
            imagenPrincipal=imagenDOM.id
            productoImagen.style.backgroundImage=`url(${imagenPrincipal})`;
            
        }
        imagenDOM.onmouseover=()=>{ // Si el usuario pasa por encima el mouse entonces mostrara la imagen como imagen principal del producto
            productoImagen.style.backgroundImage=`url(${imagenDOM.id})`;
        }
    })
    listaImagenes.onmouseleave=()=>{ // Cuando el usuario quite el mouse de la lista de imagenes, volvera a colocar la imagen por default o la ultima imagen seleccionada como imagen principal
        productoImagen.style.backgroundImage=`url(${imagenPrincipal})`;
    }
}

document.addEventListener("DOMContentLoaded",async()=>{

    // Extrae el id del URL
    const productoId = window.location.pathname.split('/').pop(); 
    const producto = await obtenerProducto(productoId!) // Si el id es "undefined" el servidor devolvera un error
    if(producto){ // Si no hay errores:
        cargarInformacionProducto(producto) // Carga la informacion general del producto en el DOM
        if(producto.variantes) cargarColoresTalles(producto) // Si existen, carga las variantes de colores y talles del producto
        verificarListaDeseados(producto) // Le define la funcion al boton de agregar el producto a la lista de deseados y verifica si el producto ya forma parte o no de la lista
    }else return // Si no se devolvio un producto entonces termina la ejecucion de la funcion
    

    // Le da funcion al boton de agregar a la lista de deseados
    const botonAgregarDeseados:HTMLElement = document.getElementById("botonAgregarDeseados")!
    botonAgregarDeseados.addEventListener('click',async ()=>{
        // Cambia el estilo del boton
        botonAgregarDeseados.classList.toggle('botonAgregarDeseados-push')
        botonAgregarDeseados.classList.toggle('botonAgregarDeseados-active') 

        // Envia la solicitud al servidor
        const respuesta = await solicitudAlternarProductoDeseado(producto?._id.toString())
        
        // Si la solicitud devuelve un problema vuelve a dejar los estilos de los botones como antes
        if(!respuesta.errors){
            botonAgregarDeseados.classList.toggle('botonAgregarDeseados-push')
            botonAgregarDeseados.classList.toggle('botonAgregarDeseados-active') 
        }
    
    })

    // Le da la funcion al boton de volver
    const botonVolver:HTMLElement = document.getElementById("catalogoProducto__volver")!
    botonVolver.addEventListener('click',()=>{
            window.history.back() // Retrocede a la pagina anterior
    })

})