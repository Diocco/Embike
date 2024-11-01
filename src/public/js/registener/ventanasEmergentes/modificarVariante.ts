import { producto } from '../../../../models/interfaces/producto';
import { variante } from '../../../../models/interfaces/variante';
import { ObjectId } from "mongoose";
import { actualizarVariantes, crearVariante, verVariantes } from '../variantes.js';

// Contenedores de ventanas emergentes
const contenedorVentanaModificar:HTMLElement = document.getElementById('modificarProducto')!
const contenedorVentanaVariantes:HTMLElement = document.getElementById('variantesProducto')!

// Contenedor de variantes de producto
const contenedorVariantes = document.getElementById('variantesProducto__variantes')! as HTMLDivElement;

// Botones
const botonAgregarVariante = document.getElementById('variantesProducto__agregarVariante')! as HTMLButtonElement
const aceptar:HTMLElement = document.getElementById("variantesProducto__aceptarRechazar__aceptar")!;
const rechazar:HTMLElement = document.getElementById("variantesProducto__aceptarRechazar__rechazar")!;

let variantes:variante[]|undefined // Almacena las variantes del producto

const alternarVentanaEmergente =(seActiva:boolean)=>{
    if(seActiva){
        // Activa la ventana emergente de las variantes del producto
        contenedorVentanaVariantes.classList.remove('noActivo')
    
        // Desactiva la ventana de modificar producto
        contenedorVentanaModificar.classList.add('noActivo')
    }else{
        // Desactiva la ventana emergente de las variantes del producto
        contenedorVentanaVariantes.classList.add('noActivo')

        // Activa la ventana de modificar producto
        contenedorVentanaModificar.classList.remove('noActivo')
    }
}

// Ventana emergente para modificar o agregar una variante de un producto a la base de datos
export const ventanaEmergenteModificarVarianteProducto=async(productoInformacion:producto):Promise<boolean> =>{
    alternarVentanaEmergente(true)

    contenedorVariantes.innerHTML=''; // Vacia el contenedor con informacion previa

    // Solicita al servidor las variantes del producto
    variantes = await verVariantes(productoInformacion._id)
    
    // Carga las distintas variables del producto, si existen
    if(variantes){ // Carga las variantes del producto
        variantes.forEach(variante => {
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

        // La manda al servidor para crearla en la base de datos, espera a que el servidor responda con el id de la variante creada
        const varianteId = await crearVariante(varianteNueva)
        
        if(varianteId){ // Si todo sale bien asigna el id de la variante a la variante nueva 
            varianteNueva._id = varianteId
            agregarVarianteDOM(contenedorVariantes,varianteNueva) // Crea la variante en el DOM
        }
    }

    // Espera la respuesta del usuario
    return new Promise<boolean>((resolve) => {
        
        rechazar.onclick=()=>{ //Si se apreta rechazar no se guardan los datos cambiados
    
            alternarVentanaEmergente(false)
            resolve(false)
        }
    
        aceptar.onclick=async ()=>{ //Si se apreta aceptar se devuelve un array con todas las variables del producto
            
            document.querySelectorAll('.boton__enError').forEach(contenedor=>contenedor.classList.remove('boton__enError')) // Elimina los estados de error, si los hay
            
            variantes = variantesDOM(productoInformacion._id) // Devuelve las variantes que hay en el DOM
            if(variantes) { // Si hay almenos una variante entonces la envia al servidor para ser guardada
                const respuesta = await actualizarVariantes(variantes,productoInformacion._id)
                if(respuesta){ // Si el servidor devuelve errores entonces marca en error los inputs correspondientes.
                    respuesta.forEach(error=>{
                        const contenedorVarianteEnError = document.getElementById(`${error.value}`)
                        if(error.path==='SKU') contenedorVarianteEnError?.querySelector('.variantesProducto__input-SKU')!.classList.add('boton__enError')
                        if(error.path==='stock') contenedorVarianteEnError?.querySelector('.variantesProducto__input-stock')!.classList.add('boton__enError')
                    })
                }else alternarVentanaEmergente(false)
            }
            
            resolve(true)
        
        }
    })

}

export const agregarVarianteDOM =(contenedor:HTMLElement,variante:variante)=>{

    // Agrega la variante al DOM
    const contenedorVariante = document.createElement('div') // Contenedor de la variante
    contenedorVariante.id = variante._id!.toString() // El id del contenedor es el mismo id que el de la variante
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
        <input class="variantesProducto__input variantesProducto__input-SKU" value="${variante.SKU}">
        <select class="variantesProducto__input variantesProducto__select-color" name="color"> ${opcionesColores}</select>
        <input class="variantesProducto__input variantesProducto__input-talle" value="${variante.talle}">
        <input class="variantesProducto__input variantesProducto__input-stock" value="${variante.stock}"  type="number">
    `
    contenedor.appendChild(contenedorVariante)
    document.getElementById('mensajeSinVariantes')?.classList.add('noActivo') // Si el mensaje de "sin variantes" esta activo entonces lo desactiva
}   

const variantesDOM =(productoID:ObjectId):variante[]=>{
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
        if(variantes[0]) variantes.push(varianteNueva) // Si el array de variantes no esta vacio entonces agrega la nueva variante
        else variantes[0] = varianteNueva // Si esta vacio entonces lo inicia con la nueva variante
        
    })
    return variantes
}


document.addEventListener('DOMContentLoaded',()=>{



})