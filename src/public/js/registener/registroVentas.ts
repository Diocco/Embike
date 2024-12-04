
//TODO
// Encabezados: IDVenta, Fecha y hora, Precio total, Metodo pago, Obervaciones
// Ventana de venta: Registro de cambios, Listado de productos, Listado de precios y descuentos, Pago combinado (si aplica)
// Opciones:Anular venta, buscar por IDVenta, rango de fechas, paginacion, modificar venta

import { convertirAInput } from "../helpers/convertirElemento.js"
import { obtenerRegistro, verRegistroVentas } from "../services/registroVentasAPI.js"
import { ventanaModificarVenta } from "./ventanasEmergentes/modificarVenta.js"

//TODO proximo
// Vendedor,Cliente,estado(completado,anulado),exportar a excel,imprimir recibo o factura,devolucion en efectivo


const indiceObservacion=()=>{
    const indiceObservacion = document.getElementById('registroVentas__indiceTabla__observacion') as HTMLButtonElement|undefined
    if(indiceObservacion){
        indiceObservacion.onclick=()=> {
            const inputFinal = convertirAInput(indiceObservacion,'registroVentas__indiceTabla__observacion-input','registroVentas-buscaObservacion','text',true,cargarRegistrosDOM)
            inputFinal.focus() // Le hace focus inmediatamente al input recien creado
        }
        if(sessionStorage.getItem('registroVentas-buscaObservacion')) convertirAInput(indiceObservacion,'registroVentas__indiceTabla__observacion-input','registroVentas-buscaObservacion','text',true,cargarRegistrosDOM)
    }
}
const indiceID=()=>{
    const indiceID = document.getElementById('registroVentas__indiceTabla__ID') as HTMLButtonElement|undefined
    if(indiceID) {
        indiceID.onclick=()=> {
            const inputFinal = convertirAInput(indiceID,'registroVentas__indiceTabla__ID-input','registroVentas-IDVenta','text',true,cargarRegistrosDOM)
            inputFinal.focus() // Le hace focus inmediatamente al input recien creado
        }
        if(sessionStorage.getItem('registroVentas-IDVenta')) convertirAInput(indiceID,'registroVentas__indiceTabla__ID-input','registroVentas-IDVenta','text',true,cargarRegistrosDOM)
    }
}
const botonModificarVenta=()=>{
    const botonesModificarVenta = document.querySelectorAll('.registroVentas__botonModificar') as NodeListOf<HTMLButtonElement>
    botonesModificarVenta.forEach((boton)=>{
        boton.onclick=async()=>{
            const IDVenta = boton.parentElement!.firstElementChild!.textContent!
            ventanaModificarVenta(IDVenta)
        }
    })
}


export const cargarRegistrosDOM=async ()=>{
    /* Contenedores */
    const contenedorRegistros = document.getElementById('registroVentas__contenedorTabla')!

    /* Parametros de busqueda */
    const desde = sessionStorage.getItem('registroVentas-desde')||undefined
    const hasta = sessionStorage.getItem('registroVentas-hasta')||undefined
    const IDVenta = sessionStorage.getItem('registroVentas-IDVenta')||undefined
    const metodo = sessionStorage.getItem('registroVentas-metodo')||undefined
    const estado = sessionStorage.getItem('registroVentas-estado')||undefined
    const buscaObservacion = sessionStorage.getItem('registroVentas-buscaObservacion')||undefined
    const pagina = sessionStorage.getItem('registroVentas-pagina')||undefined

    /* Realiza la busqueda de los elementos en la base de datos */
    let respuesta = await verRegistroVentas(desde,hasta,pagina,IDVenta,metodo,estado,buscaObservacion)
    if(respuesta.registroVentas.length<1&&respuesta.registroVentasCantidad>0){
        // Si la pagina de la respuesta no tiene elementos entonces vuelve hacer la busqueda para la primer pagina
        respuesta = await verRegistroVentas(desde,hasta,'1',IDVenta,metodo,estado,buscaObservacion)
        sessionStorage.setItem('registroVentas-pagina','1')
    }

    // Vacia el contenedor y deja solo el indice
    contenedorRegistros.innerHTML=` 
    <div id="registroVentas__indiceTabla" class="registroVentas__fila">
                <div id="registroVentas__indiceTabla__ID">ID</div>
                <div id="registroVentas__indiceTabla__hora">Hora</div>
                <div id="registroVentas__indiceTabla__total">Total</div>
                <div id="registroVentas__indiceTabla__metodo">Metodo</div>
                <div id="registroVentas__indiceTabla__observacion">Observaciones</div>
    </div>`

    if(respuesta.registroVentasCantidad===0){ // Si no se encontraron elementos para mostrar entonces muestra un mensaje al usuario
        contenedorRegistros.innerHTML=contenedorRegistros.innerHTML+`
        <div id="registroVentas__mensajeSinElementos" >No se encontro ningun elemento para los parametros de busqueda</div>
        `
        document.getElementById('registroVentas__indice')!.innerHTML='' // Vacia el contenedor de paginado
        return
    }
    
    
    // Agrega los registros al DOM
    const fragmento = document.createDocumentFragment()
    respuesta.registroVentas.forEach(registro=>{
        const fecha = new Date(registro.fechaVenta)
        const contenedorRegistro = document.createElement('div');
        contenedorRegistro.className="registroVentas__fila";
        contenedorRegistro.innerHTML=`
            <div>${registro._id}</div>
            <div>${fecha.toLocaleString('es-AR')||''}</div>
            <div>$ ${registro.total.toLocaleString('es-AR')||''}</div>
            <div>${registro.metodo2?'Combinado':registro.metodo1||''}</div>
            <div class="registroVentas__fila__observacion" title="${registro.observacion||''}">${registro.observacion||''}</div>
            <button class="botonRegistener1 registroVentas__botonModificar"><i class="fa-solid fa-pencil" aria-hidden="true"></i></button>
            <button class="botonRegistener1 registroVentas__botonVer"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
            <button class="botonRegistener1 registroVentas__botonAnular"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        `

        fragmento.appendChild(contenedorRegistro)
    })
    contenedorRegistros.appendChild(fragmento)


    
    cargarPaginadoRegistros(respuesta.paginasCantidad+1)
    botonModificarVenta()
}

const cargarPaginadoRegistros =(cantidadPaginas:number /* Cantidad de paginas total necesarias para ver todos los resultados*/)=>{
    // Agrega las paginas de los elementos
    const contenedorGeneral = document.getElementById('registroVentas__contenido')!
    const contenedorPaginas = document.getElementById('registroVentas__indice')!
    contenedorPaginas.innerHTML='' // Vacia el contenedor previo

    // Calcula el rango de paginado
    let paginaDecena = Number(sessionStorage.getItem('registroVentas-paginaDecena'))||0
    const desdePagina = paginaDecena===0?1:paginaDecena*10 // El inicio de la pagina esta en el rango: [1,10,20,30,...,N]
    let paginaSeleccionada = Number(sessionStorage.getItem('registroVentas-pagina')); // Pagina seleccionada actual
    const paginaHasta = cantidadPaginas>paginaDecena*10+9?paginaDecena*10+9:cantidadPaginas // El final del rango es 9 mas que la inicial en el caso de que la cantidad de paginas sea mayor que eso, sino el final es la cantidad de paginas 
    
    if(!(desdePagina<=paginaSeleccionada&&paginaSeleccionada<=paginaHasta)) { // Verifica que la pagina seleccionada actual se encuentre dentro de la cantidad de paginas actuales
        paginaSeleccionada=paginaDecena===0?1:paginaDecena*10;
        sessionStorage.setItem('registroVentas-pagina',`${paginaSeleccionada}`)
    }
    

    if(paginaDecena>1){ // Si las decenas del paginado es mayor que 1 entonces agrega un boton para volver al principio
        const botonReducirPaginado = document.createElement('button')
        botonReducirPaginado.className='botonRegistener2'
        botonReducirPaginado.innerHTML=`<i class="fa-solid fa-angles-left"></i>`
        botonReducirPaginado.onclick=()=>{
            paginaDecena=paginaDecena-1
            sessionStorage.setItem('registroVentas-paginaDecena',`0`) // Vuelve a la primera pagina
            sessionStorage.setItem('registroVentas-pagina',`1`) // Deja seleccionado la primera pagina
            cargarRegistrosDOM() // Recarga los registros
        }
        contenedorPaginas.appendChild(botonReducirPaginado)
    }

    if(paginaDecena>0){ // Si las decenas del paginado es mayor que cero entonces agrega un boton para reducirlo
        const botonReducirPaginado = document.createElement('button')
        botonReducirPaginado.className='botonRegistener2'
        botonReducirPaginado.innerHTML=`<i class="fa-solid fa-angle-left"></i>`
        botonReducirPaginado.onclick=()=>{
            paginaDecena=paginaDecena-1
            sessionStorage.setItem('registroVentas-paginaDecena',`${paginaDecena}`) // Aumenta el valor de la decena en el indice de paginas
            sessionStorage.setItem('registroVentas-pagina',`${paginaDecena===0?1:paginaDecena*10}`)       
            cargarRegistrosDOM() // Recarga los registros
        }
        contenedorPaginas.appendChild(botonReducirPaginado)
    }

    // Agrega los indices dentro del contenedor
    for (let i = desdePagina; i < paginaHasta+1; i++) {
        if(i===cantidadPaginas) return
        const indice = document.createElement('button')
        indice.className='botonRegistener2'
        if(paginaSeleccionada===i) indice.classList.add('boton__activo2') // Si el boton representa a la pagina actualmente activa entonces le da el estilo de activado
        indice.innerText=i.toString();
        indice.onclick=()=>{
            sessionStorage.setItem('registroVentas-pagina',i.toString())
            cargarRegistrosDOM()
        }
        
        contenedorPaginas.appendChild(indice)
    }

    if(paginaHasta<cantidadPaginas){ // Si la cantidad de paginas para seleccionar es menor a la cantidad de paginas totales entonces agrega un boton para aumentar la cantidad de paginas seleccionables
        const botonAumentarPaginado = document.createElement('button')
        botonAumentarPaginado.className='botonRegistener2'
        botonAumentarPaginado.innerHTML=`<i class="fa-solid fa-angle-right"></i>`
        botonAumentarPaginado.onclick=()=>{
            paginaDecena=paginaDecena+1
            sessionStorage.setItem('registroVentas-paginaDecena',`${paginaDecena}`) // Aumenta el valor de la decena en el indice de paginas
            sessionStorage.setItem('registroVentas-pagina',`${paginaDecena===0?1:paginaDecena*10}`)
            cargarRegistrosDOM() // Recarga los registros
        }
        contenedorPaginas.appendChild(botonAumentarPaginado)
    }

    if(paginaHasta<cantidadPaginas-10){ // Si la cantidad de paginas para seleccionar es menor a la cantidad de paginas totales entonces agrega un boton para aumentar la cantidad de paginas seleccionables
        const botonAumentarPaginado = document.createElement('button')
        botonAumentarPaginado.className='botonRegistener2'
        botonAumentarPaginado.innerHTML=`<i class="fa-solid fa-angles-right"></i>`
        botonAumentarPaginado.onclick=()=>{
            paginaDecena=paginaDecena+1
            sessionStorage.setItem('registroVentas-paginaDecena',`${cantidadPaginas}`) // Aumenta el valor de la decena en el indice de paginas
            sessionStorage.setItem('registroVentas-pagina',`${paginaDecena===0?1:paginaDecena*10}`)
            cargarRegistrosDOM() // Recarga los registros
        }
        contenedorPaginas.appendChild(botonAumentarPaginado)
    }


    contenedorGeneral.appendChild(contenedorPaginas)
}

document.addEventListener('DOMContentLoaded',()=>{
    indiceObservacion()
    indiceID()
})
