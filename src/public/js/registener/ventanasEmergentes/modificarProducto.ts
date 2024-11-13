import { EspecificacionI, producto } from "../../../../models/interfaces/producto.js";


import { ventanaEmergenteCargarImagenProducto } from "./modificarFoto.js";
import { actualizarProducto, crearProducto, solicitudEliminarProducto } from "../../services/productosAPI.js";
import { buscarCargarProductos, categorias } from "../index.js";


import { variante } from "../../../../models/interfaces/variante.js";
import { actualizarVariantes, crearVariante, eliminarVariante } from "../../services/variantesAPI.js";
import { solicitudAgregarCategoria } from "../../services/categoriasAPI.js";
import { buscarCargarCategorias } from "../../helpers/categorias.js";



// Contenedores de la ventana emergente
const contenedorVentanaEmergente:HTMLElement = document.getElementById('ventanaEmergenteFondo')!
const ventanaEmergente:HTMLElement = document.getElementById('modificarProducto')!

// Contenedor de variantes de producto
const contenedorVariantes = document.getElementById('variantesProducto__variantes')! as HTMLDivElement;

// Contenedor de las especificaciones de producto
const contenedorEspecificaciones = document.getElementById('especificacionesProducto__especificaciones')! as HTMLDivElement;

// Input en donde el usuario agregara las diferentes caracteristicas del producto
const id = document.getElementById("modificarProducto__caracteristicas__input__id")! as HTMLInputElement ;
const nombre = document.getElementById("modificarProducto__caracteristicas__input__nombre")! as HTMLInputElement ;
const precio = document.getElementById("modificarProducto__caracteristicas__input__precio")! as HTMLInputElement;
const marca = document.getElementById("modificarProducto__caracteristicas__input__marca")! as HTMLInputElement;
const modelo = document.getElementById("modificarProducto__caracteristicas__input__modelo")! as HTMLInputElement;
const categoria = document.getElementById("modificarProducto__caracteristicas__select__categoria")! as HTMLSelectElement;
const categoriaIngresada = document.getElementById("modificarProducto__caracteristicas__input__categoria")! as HTMLInputElement;
const descripcion = document.getElementById("modificarProducto__fotoDescripcion__textarea")! as HTMLTextAreaElement;

// Botones
const aceptar:HTMLElement = document.getElementById("modificarProducto__aceptar")!;
const cancelar:HTMLElement = document.getElementById("modificarProducto__cancelar")!;
const botonAgregarVariante = document.getElementById('variantesProducto__agregarVariante')! as HTMLButtonElement
const botonAgregarEspecificacion = document.getElementById('especificacionesProducto__button')! as HTMLButtonElement




// Ventana general
export const ventanaEmergenteModificarProducto = async(producto?:producto) =>{

    // Elimina los estados de error previos, si existen
    contenedorVentanaEmergente.querySelectorAll('.boton__enError').forEach(botonEnError=>botonEnError.classList.remove('boton__enError'))

    // Activa la ventana emergente
    contenedorVentanaEmergente.classList.remove('noActivo')
    ventanaEmergente.classList.remove('noActivo')

    //Les da un valor inicial, borrando cualquier valor viejo que tenga
    id.value="";
    descripcion.value='';
    nombre.value="";
    precio.value="";
    marca.value="";
    modelo.value="";
    categoriaIngresada.value=''
    descripcion.textContent=''

    // Define la funcion del boton 
    let esCrearProducto=false
    if(!producto) {
        producto = await crearProducto() // Crea un nuevo producto
        esCrearProducto=true
    
    }; // Si a la funcion no se le pasa la informacion de un producto entonces crea uno nuevo
    if(!producto) return // Si fallo la creacion del producto entonces resulta en un error fatal

    cargarProductoDOM(producto) // Carga en el DOM toda la informacion del producto
    cargarVariantesDOM(producto) // Carga la informacion de las variantes
    cargarEspecificacionesDOM(producto) // Carga la informacion de las variantes
    

    // Espera que el usuario aprete el boton "volver" antes de guardar todos los cambios, el bucle se repite hasta que el usuario introduzca todos los datos necesarios correctamente
    let nodosEnError:NodeListOf<HTMLInputElement>
    const formularioProducto = document.getElementById('modificarProducto__caracteristicas')! as HTMLFormElement
    do {

        // Espera la respuesta del usuario
        await new Promise<void>((resolve) => {
            aceptar.onclick=()=>resolve();
            cancelar.onclick=async ()=>{
                if(esCrearProducto) await solicitudEliminarProducto(producto._id.toString()) // Si la ventana es para crear un producto, entonces lo elimina de la base de datos

                // Desactiva la ventana emergente
                contenedorVentanaEmergente.classList.add('noActivo')
                ventanaEmergente.classList.add('noActivo')
                return 
            };
        })

        let datosFormulario = new FormData(formularioProducto) // Lee los datos introducidos por el usuario


        // Toma los datos del producto en el formulario
        const especificaciones:EspecificacionI[] = obtenerEspecificacionesDOM()
        datosFormulario.set('especificacionesJSON',JSON.stringify(especificaciones))


        // Si los hay, elimina los estados de error en la ventana emergente
        contenedorVentanaEmergente.querySelectorAll('.boton__enError').forEach(contenedor=>contenedor.classList.remove('boton__enError')) 

        await Promise.all([
            validarVariantesDOM(producto._id.toString()), // Verifica que las variantes ingresadas sean validas
            validarCaracteristicasDOM(datosFormulario) // Verifica que las caracteristicas del producto sean validas
        ])

        // Busca estados de error
        nodosEnError = contenedorVentanaEmergente.querySelectorAll('.boton__enError')

        // Si no hay errores envia la solicitud para modificar el usuario 
        if(nodosEnError.length<1) {
            const respuesta = await actualizarProducto(datosFormulario,producto._id.toString()); // Actualiza los datos del producto en la base de datos
            if(respuesta.errors.length>0){
                respuesta.errors.forEach(error=>{
                    if(error.path==='nombre') nombre.classList.add('boton__enError')
                    if(error.path==='precio') precio.classList.add('boton__enError')
                    if(error.path==='marca') marca.classList.add('boton__enError')
                    if(error.path==='modelo') modelo.classList.add('boton__enError')
                    if(error.path==='categoria') categoria.classList.add('boton__enError')
                })
            }
            // Vuelve a buscar nodos en estado de error
            nodosEnError = contenedorVentanaEmergente.querySelectorAll('.boton__enError')
        }

        // Vuelve a buscar nodos en estado de error
        } while (nodosEnError.length>0);

    
    // Desactiva la ventana emergente
    contenedorVentanaEmergente.classList.add('noActivo')
    ventanaEmergente.classList.add('noActivo')
    
    // Vuelve a cargar los productos actualizados
    buscarCargarProductos()
    return

}


// Informacion del producto
export const agregarImagenesDOM = async(productoInformacion:producto)=>{
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

const cargarProductoDOM =(producto:producto)=>{

    const categoriaCompleta = categorias!.find(categoria=>categoria._id===producto.categoria)!

    // Coloca la informacion en los inputs correspondientes
    id.value = producto._id.toString();
    nombre.value = producto.nombre==="Sin nombre"?'':producto.nombre;
    precio.value = `${producto.precio===0?'':producto.precio}`;
    marca.value = producto.marca==="Sin marca"?'':producto.marca;
    modelo.value = producto.modelo==="Sin modelo"?'':producto.modelo;
    categoria.value = categoriaCompleta.nombre==="Sin categoria"?'':categoriaCompleta.nombre;
    descripcion.textContent = producto.descripcion;

    // Carga las imagenes del producto en el DOM
    agregarImagenesDOM(producto);
}

const validarCaracteristicasDOM = async(datosFormulario:FormData)=>{

    // Si el usuario ingreso una nueva categoria entonces la agrega
    const categoriaNueva:string|undefined = categoriaIngresada.value
    if (categoriaNueva) {
        const categoriaNuevaCompleta = await solicitudAgregarCategoria(categoriaNueva) // La agrega a la base de datos
        if(categoriaNuevaCompleta) {
            categorias?.push(categoriaNuevaCompleta) // Si todo sale bien agrega la nueva categoria a la lista de categorias dentro del programa
            datosFormulario.set('categoria',categoriaNueva) // Agrega la categoria al FormData para enviarlo junto con la demas informacion del producto
            
            // Vuelve a cargar las categorias para reflejar los cambios TODO la categoria no aparece hasta recien que se actualiza la pagina, lo cual es un error
            const contenedorCategorias:HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__categorias')!
            const contenedorOpcionesCategorias = document.getElementById('modificarProducto__caracteristicas__select__categoria')! as HTMLSelectElement
            buscarCargarCategorias(contenedorCategorias,contenedorOpcionesCategorias) 
        }
    }
    // Verifica que no esten vacias
    if(!nombre.value) nombre.classList.add('boton__enError')
    if(!precio.value) precio.classList.add('boton__enError')
    if(!marca.value) marca.classList.add('boton__enError')
    if(!modelo.value) modelo.classList.add('boton__enError')
    if(!categoria.value) categoria.classList.add('boton__enError')
    
}

// Variantes
export const cargarVariantesDOM=async(productoInformacion:producto) =>{


    contenedorVariantes.innerHTML=''; // Vacia el contenedor con informacion previa
    
    // Carga las distintas variables del producto, si existen
    if(productoInformacion.variantes.length>0){ // Carga las variantes del producto
        (productoInformacion.variantes as variante[]).forEach(variante => {
            agregarVarianteDOM(contenedorVariantes,variante)
        });
    }else{// Si el producto no tiene variantes entonces muestra un mensaje de error
        // Contenedor de la variante
        const contenedorVariante = document.createElement('div')
        contenedorVariante.id='mensajeSinVariantes';
        contenedorVariante.textContent='No hay ninguna variante para mostrar'
    
        contenedorVariantes.appendChild(contenedorVariante)
    }

    // Carga la funcion de agregar variante en la ventana de variantes de producto
    botonAgregarVariante.onclick=async(event)=>{
        event.preventDefault()

        // Crea una variable nueva con variables por default
        let varianteNueva:variante = {
            producto: productoInformacion._id,
            color: '',
            talle: '',
            SKU: (new Date().getTime()).toString(), // Crea un SKU por default, el usuario luego puede definir uno diferente
            stock: 0
        }

        agregarVarianteDOM(contenedorVariantes,varianteNueva) // Crea la variante en el DOM
        
    }


}

export const agregarVarianteDOM =(contenedor:HTMLElement,variante:variante)=>{

    // Agrega la variante al DOM
    const contenedorVariante = document.createElement('div') // Contenedor de la variante
    if(variante._id) contenedorVariante.id = variante._id.toString() // Si la variante existe en la base de datos deberia tener un id, asi que id del contenedor es el mismo id que el de la variante
    contenedorVariante.classList.add('variantesProducto__variantes__div');

    let opcionesColores:string = `
    <option>Rojo</option>
    <option>Naranja</option>
    <option>Azul</option>
    <option>Verde</option>
    <option>Negro</option>
    <option>Blanco</option>
    <option>Amarillo</option>
    <option>Gris</option>
    <option>Rosa</option>
    <option>Marrón</option>
    <option>Celeste</option>
    <option>Violeta</option>
    `

    // Define cual es el color seleccionado
    opcionesColores = opcionesColores.replace(`>${variante.color}`,` selected>${variante.color}`)
    contenedorVariante.innerHTML=`
        <input class="inputRegistener1 variantesProducto__input-SKU" value="${variante.SKU}">
        <select class="inputRegistener1 variantesProducto__select-color" name="color"> ${opcionesColores}</select>
        <input class="inputRegistener1 variantesProducto__input-talle" value="${variante.talle}">
        <input class="inputRegistener1 variantesProducto__input-stock" value="${variante.stock}"  type="number">
    `

    // Crea el boton para eliminar la variante
    const botonEliminarVariante = document.createElement('button')
    botonEliminarVariante.classList.add('fa-solid')
    botonEliminarVariante.classList.add('fa-trash')
    botonEliminarVariante.classList.add('botonRegistener3')
    botonEliminarVariante.classList.add('variante__eliminar')
    botonEliminarVariante.classList.add('botonNegativo')

    
    contenedorVariante.appendChild(botonEliminarVariante) // Agrega el boton al contenedor
    contenedor.appendChild(contenedorVariante) // Agrega el contenedor al DOM
    botonEliminarVariante.onclick=async()=>{
        const varianteId:string|undefined = botonEliminarVariante.parentElement!.id;
        if(!varianteId) botonEliminarVariante.parentElement!.className="noActivo"; // Si la variante no esta en la base de datos simplemente la oculta en el DOM
        else{ // Si esta en la base de datos se envia una solicitud al servidor
            const respuesta = await eliminarVariante(varianteId);
            if(respuesta===0) botonEliminarVariante.parentElement!.classList.add('noActivo'); // Si la variante se elimino de forma exitosa oculta la variante
        }
    }
    

    document.getElementById('mensajeSinVariantes')?.classList.add('noActivo') // Si el mensaje de "sin variantes" esta activo entonces lo desactiva
}

const obtenerVariantesDOM =(productoID:string):variante[]=>{
    // Devuelve un array con todas las variantes del producto que se encuetran en el DOM

    // Inicializa la variable que almacena todas las variantes del producto, el indice de los colores dentro de la variable "variantes" y "arrayColoresVariables" comparten el mismo orden
    let variantes:variante[]=[]

    const contenedoresVariantesProducto = document.querySelectorAll('.variantesProducto__variantes__div') as NodeListOf<HTMLDivElement> // Almacena todos los contenedores de las variantes del producto

    // Recorre todos los contenedores de variantes de un producto
    contenedoresVariantesProducto.forEach(contenedorVariante=>{


        const SKU:string = (contenedorVariante.querySelector('.variantesProducto__input-SKU')! as HTMLInputElement).value
        const color:string = (contenedorVariante.querySelector('.variantesProducto__select-color')! as HTMLSelectElement).value
        const talle:string = (contenedorVariante.querySelector('.variantesProducto__input-talle')! as HTMLInputElement).value
        const stock:number = Number((contenedorVariante.querySelector('.variantesProducto__input-stock')! as HTMLInputElement).value)

        const varianteNueva:variante={
            producto:productoID,
            _id:contenedorVariante.id,
            SKU,
            color,
            talle,
            stock
        }

        // Agrega las nueva variante
        variantes.push(varianteNueva) // Si el array de variantes no esta vacio entonces agrega la nueva variante
    })
    return variantes
}

const validarVariantesDOM =async(productoId:string)=>{
    // Verifica las variantes

    const variantes = obtenerVariantesDOM(productoId) // Devuelve las variantes que hay en el DOM
    if(variantes.length<1) return // Si no hay variantes entonces termina la ejecucion de la funcion

    // Si hay almenos una variante entonces la envia al servidor para ser guardada
    const errores = await actualizarVariantes(variantes,productoId)
    if(!errores) return // Si no hay errores entonces entonces termina la ejecucion de la funcion

    // Marca en error los inputs correspondientes.
    errores.forEach(error=>{
        const contenedorVarianteEnError = document.getElementById(`${error.value}`)
        if(error.path==='SKU') contenedorVarianteEnError?.querySelector('.variantesProducto__input-SKU')!.classList.add('boton__enError')
        if(error.path==='stock') contenedorVarianteEnError?.querySelector('.variantesProducto__input-stock')!.classList.add('boton__enError')
    })
}

// Especificaciones
const cargarEspecificacionesDOM =(productoInformacion:producto)=>{
    
    contenedorEspecificaciones.innerHTML=''; // Vacia el contenedor con informacion previa
    
    // Carga las distintas variables del producto, si existen
    if(productoInformacion.especificaciones.length>0){ // Carga las variantes del producto
        productoInformacion.especificaciones.forEach(especificacion => {
            agregarEspecificacionDOM(especificacion)
        });
    }else{// Si el producto no tiene especificaciones entonces muestra un mensaje de error
        // Contenedor de la variante
        const contenedorEspecificacion = document.createElement('div')
        contenedorEspecificacion.id='mensajeSinEspecificaciones';
        contenedorEspecificacion.textContent='No hay ninguna especificacion para mostrar'
    
        contenedorEspecificaciones.appendChild(contenedorEspecificacion)
    }

    // Carga la funcion de agregar una especificacion en la ventana de especificaciones de producto
    botonAgregarEspecificacion.onclick=async(event)=>{
        event.preventDefault()

        // Crea una nueva especificacion por default
        let especificacionNueva:EspecificacionI = {
            nombre:'',
            descripcion:''
        }
        agregarEspecificacionDOM(especificacionNueva)
    }
}

const agregarEspecificacionDOM=(especificacion:EspecificacionI)=>{
    // Agrega la especificacion al DOM
    const contenedorEspecificacion = document.createElement('div') // Contenedor de la variante
    contenedorEspecificacion.classList.add('especificacionesProducto__especificacion');

    contenedorEspecificacion.innerHTML=`
        <input class="inputRegistener1 especificacion__input-nombre" value='${especificacion.nombre?especificacion.nombre:''}'>
        <input class="inputRegistener1 especificacion__input-descripcion" value='${especificacion.descripcion?especificacion.descripcion:''}'>
    `

    // Boton para eliminar una especificacion
    const botonEliminarEspecificacion = document.createElement('button')
    botonEliminarEspecificacion.classList.add('fa-solid')
    botonEliminarEspecificacion.classList.add('fa-trash-can')
    botonEliminarEspecificacion.classList.add('botonRegistener3')
    botonEliminarEspecificacion.classList.add('especificacion__eliminar')
    botonEliminarEspecificacion.classList.add('botonNegativo')
    botonEliminarEspecificacion.onclick=()=>{
        botonEliminarEspecificacion.parentElement!.classList.add('noActivo')
        botonEliminarEspecificacion.parentElement!.classList.remove('especificacionesProducto__especificacion')
    }

    contenedorEspecificacion.appendChild(botonEliminarEspecificacion) // Agrega el boton al contenedor de la especificacion
    contenedorEspecificaciones.appendChild(contenedorEspecificacion) // Agrega la especificacion al DOM



    document.getElementById('mensajeSinEspecificaciones')?.classList.add('noActivo') // Si el mensaje de "sin variantes" esta activo entonces lo desactiva
}

const obtenerEspecificacionesDOM=()=>{
    // Devuelve un array con todas las especificaciones del producto que se encuentren en el DOM

    // Inicializa la variable que almacena todas las especificaciones del producto
    let especificaciones:EspecificacionI[]=[]

    const contenedoresEspecificacionesProducto = document.querySelectorAll('.especificacionesProducto__especificacion') as NodeListOf<HTMLDivElement> // Almacena todos los contenedores de las variantes del producto

    // Recorre todos los contenedores de variantes de un producto
    contenedoresEspecificacionesProducto.forEach(contenedorEspecificacion=>{


        const nombre:string = (contenedorEspecificacion.querySelector('.especificacion__input-nombre')! as HTMLInputElement).value
        const descripcion:string = (contenedorEspecificacion.querySelector('.especificacion__input-descripcion')! as HTMLSelectElement).value

        const especificacion:EspecificacionI={
            nombre,
            descripcion
        }

        // Agrega las nueva especificacion
        especificaciones.push(especificacion) 
        
    })
    return especificaciones
}
