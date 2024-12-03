
//TODO
// Encabezados: IDVenta, Fecha y hora, Precio total, Metodo pago, Obervaciones
// Ventana de venta: Registro de cambios, Listado de productos, Listado de precios y descuentos, Pago combinado (si aplica)
// Opciones:Anular venta, buscar por IDVenta, rango de fechas, paginacion, modificar venta

import { convertirAInput } from "../helpers/convertirElemento.js"
import { obtenerRegistro, verRegistroVentas } from "../services/registroVentasAPI.js"
import { ventanaModificarVenta } from "./ventanasEmergentes/modificarVenta.js"

//TODO proximo
// Vendedor,Cliente,estado(completado,anulado),exportar a excel,imprimir recibo o factura,devolucion en efectivo


export const cargarRegistroVentas =async()=>{
    await cargarRegistrosDOM()
    cargarBotones()
}
const indiceObservacion=()=>{
    const indiceObservacion = document.getElementById('registroVentas__indiceTabla__observacion') as HTMLButtonElement|undefined
    if(indiceObservacion){
        indiceObservacion.onclick=()=> {
            const inputFinal = convertirAInput(indiceObservacion,'registroVentas__indiceTabla__observacion-input','registroVentas-buscaObservacion','text',true,cargarRegistroVentas)
            inputFinal.focus() // Le hace focus inmediatamente al input recien creado
        }
        if(sessionStorage.getItem('registroVentas-buscaObservacion')) convertirAInput(indiceObservacion,'registroVentas__indiceTabla__observacion-input','registroVentas-buscaObservacion','text',true,cargarRegistroVentas)
    }
}
const indiceID=()=>{
    const indiceID = document.getElementById('registroVentas__indiceTabla__ID') as HTMLButtonElement|undefined
    if(indiceID) {
        indiceID.onclick=()=> {
            const inputFinal = convertirAInput(indiceID,'registroVentas__indiceTabla__ID-input','registroVentas-IDVenta','text',true,cargarRegistroVentas)
            inputFinal.focus() // Le hace focus inmediatamente al input recien creado
        }
        if(sessionStorage.getItem('registroVentas-IDVenta')) convertirAInput(indiceID,'registroVentas__indiceTabla__ID-input','registroVentas-IDVenta','text',true,cargarRegistroVentas)
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

const cargarBotones=()=>{
    indiceObservacion()
    indiceID()
    botonModificarVenta()
}
const cargarRegistrosDOM=async ()=>{
    const contenedorRegistros = document.getElementById('registroVentas__contenedorTabla')!
    const contenedorGeneral = document.getElementById('registroVentas__contenido')!

    const desde = sessionStorage.getItem('registroVentas-desde')||undefined
    const hasta = sessionStorage.getItem('registroVentas-hasta')||undefined
    const IDVenta = sessionStorage.getItem('registroVentas-IDVenta')||undefined
    const metodo = sessionStorage.getItem('registroVentas-metodo')||undefined
    const estado = sessionStorage.getItem('registroVentas-estado')||undefined
    const buscaObservacion = sessionStorage.getItem('registroVentas-buscaObservacion')||undefined
    const pagina = sessionStorage.getItem('registroVentas-pagina')||undefined

    const respuesta = await verRegistroVentas(desde,hasta,pagina,IDVenta,metodo,estado,buscaObservacion)
    
    // Vacia el contenedor y deja solo el indice
    contenedorRegistros.innerHTML=` 
    <div id="registroVentas__indiceTabla" class="registroVentas__fila">
                <div id="registroVentas__indiceTabla__ID">ID</div>
                <div id="registroVentas__indiceTabla__hora">Hora</div>
                <div id="registroVentas__indiceTabla__total">Total</div>
                <div id="registroVentas__indiceTabla__metodo">Metodo</div>
                <div id="registroVentas__indiceTabla__observacion">Observaciones</div>
    </div>`

    if(respuesta.registroVentasCantidad===0){
        contenedorRegistros.innerHTML=contenedorRegistros.innerHTML+`
        <div id="registroVentas__mensajeSinElementos" >No se encontro ningun elemento para los parametros de busqueda</div>
        `
    }
    else{
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

        // Agrega las paginas de los elementos
        const contenedorPaginas = document.getElementById('registroVentas__indice')!
        contenedorPaginas.innerHTML='' // Vacia el contenedor previo

        // Agrega los indices dentro del contenedor
        for (let i = 1; i < respuesta.paginasCantidad+1; i++) {
            const indice = document.createElement('button')
            indice.className='botonRegistener2'
            if(Number(sessionStorage.getItem('registroVentas-pagina'))===i) indice.classList.add('boton__activo2') // Si el boton representa a la pagina actualmente activa entonces le da el estilo de activado
            indice.innerText=i.toString();
            indice.onclick=()=>{
                sessionStorage.setItem('registroVentas-pagina',i.toString())
                cargarRegistroVentas()
            }

            contenedorPaginas.appendChild(indice)
        }
        contenedorGeneral.appendChild(contenedorPaginas)
        
        
    }
}

