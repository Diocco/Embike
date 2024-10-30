import { producto, variante } from '../../../../models/interfaces/producto';

// Contenedores de ventanas emergentes
const contenedorVentanaModificar:HTMLElement = document.getElementById('modificarProducto')!
const contenedorVentanaVariantes:HTMLElement = document.getElementById('variantesProducto')!

// Contenedor de variantes de producto
const contenedorVariantes = document.getElementById('variantesProducto__variantes')! as HTMLDivElement;

// Botones
let aceptar:HTMLElement = document.getElementById("variantesProducto__aceptarRechazar__aceptar")!;
let rechazar:HTMLElement = document.getElementById("variantesProducto__aceptarRechazar__rechazar")!;

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
export function ventanaEmergenteModificarVarianteProducto(productoInformacion:producto):Promise<variante[] | undefined> {
    alternarVentanaEmergente(true)
    
    // Carga las distintas variables del producto
    contenedorVariantes.innerHTML='' // Vacia el contenedor con informacion previa
    productoInformacion.variantes.forEach(variante => {
        agregarVarianteDOM(contenedorVariantes,variante)
    });


    // Espera la respuesta del usuario
    return new Promise<variante[]|undefined>((resolve) => {
        
        rechazar.onclick=()=>{ //Si se apreta rechazar no se guardan los datos cambiados
    
            alternarVentanaEmergente(false)
            resolve(undefined)
        }
    
        aceptar.onclick=()=>{ //Si se apreta aceptar se devuelve un array con todas las variables del producto
    
            const variantes = variantesDOM()
            alternarVentanaEmergente(false)
            resolve(variantes)
        
            }
    })

}

export const agregarVarianteDOM =(contenedor:HTMLElement,variante:variante|undefined=undefined)=>{
    // Si no recibe como argumento la variable "variante" entonces la inicia con valores genericos
    if(!variante){
        variante={
            color:'Negro',
            caracteristicas:[{
                talle:'',
                SKU:'',
                stock:0
            }]
        }
    }

    // Recorre la variante y las agrega al DOM
    variante.caracteristicas.forEach(caracteristica =>{
        // Contenedor de la variante
        const contenedorVariante = document.createElement('div')
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
            <input class="variantesProducto__input variantesProducto__input-SKU" value="${caracteristica.SKU}">
            <select class="variantesProducto__input variantesProducto__select-color" name="color"> ${opcionesColores}</select>
            <input class="variantesProducto__input variantesProducto__input-talle" value="${caracteristica.talle}">
            <input class="variantesProducto__input variantesProducto__input-stock" value="${caracteristica.stock}"  type="number">
        `
        contenedor.appendChild(contenedorVariante)
    })

}   

const variantesDOM =():variante[]=>{
    // Devuelve un array con todas las variantes del producto que se encuetran en el DOM
    const coloresVariables = document.querySelectorAll('.variantesProducto__select-color') as NodeListOf<HTMLSelectElement> // Almacena todos los contenedores de los colores de las variables
    let setColoresVariables:Set<string> = new Set() // Almacena todos los colores de las variables

    // Primero recorre las variantes para almacenar todos los diferentes colores
    coloresVariables.forEach(selector=>{
        setColoresVariables.add(selector.value)
    })

    const arrayColoresVariables = Array.from(setColoresVariables) // Convierte el set de la lista de colores a un array

    // Inicializa la variable que almacena todas las variantes del producto, el indice de los colores dentro de la variable "variantes" y "arrayColoresVariables" comparten el mismo orden
    let variantes:variante[]=[]

    const contenedoresVariantesProducto = document.querySelectorAll('.variantesProducto__variantes__div') as NodeListOf<HTMLDivElement> // Almacena todos los contenedores de las variantes del producto

    // Recorre todos los contenedores de variantes de un producto
    contenedoresVariantesProducto.forEach(contenedorVariante=>{
        const SKU:string = (contenedorVariante.querySelector('.variantesProducto__input-SKU')! as HTMLInputElement).value
        const color:string = (contenedorVariante.querySelector('.variantesProducto__select-color')! as HTMLSelectElement).value
        const talle:string = (contenedorVariante.querySelector('.variantesProducto__input-talle')! as HTMLInputElement).value
        const stock:number = Number((contenedorVariante.querySelector('.variantesProducto__input-stock')! as HTMLInputElement).value)

        const indiceVariante = arrayColoresVariables.indexOf(color) // El indice que tiene el color de la variante dentro del array de colores es el mismo indice que tiene la variante actual dentro del array de variantes
        const caracteristica={
                SKU,
                talle,
                stock
            }
        
        // Agrega las nueva variante

        if(variantes[indiceVariante]){
            // Si el color de la variable ya esta inicializado entonces solo agrega una nueva caracteristica
            variantes[indiceVariante].caracteristicas.push(caracteristica)
        }else{
            // Si no esta inicializada la inicializa
            variantes[indiceVariante]={
                color,
                caracteristicas:[caracteristica]
            }
        }
        
    })
    return variantes
}


document.addEventListener('DOMContentLoaded',()=>{

    // Carga la funcion de agregar variante en la ventana de variantes de producto
    const botonAgregarVariante = document.getElementById('variantesProducto__agregarVariante')! as HTMLButtonElement
    const contenedorVariantes = document.getElementById('variantesProducto__variantes')! as HTMLDivElement;
    botonAgregarVariante.addEventListener('click',(event)=>{
        event.preventDefault()
        agregarVarianteDOM(contenedorVariantes)
    })

})