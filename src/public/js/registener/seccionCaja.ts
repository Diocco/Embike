import { MetodoPagoI } from "../../../models/interfaces/metodosPago.js"
import { usuario } from "../../../models/interfaces/usuario.js"
import { usuarioVerificado } from "../global.js"
import { solicitudObtenerMetodosPago } from "../services/metodosPagoAPI.js"
import { metodosPago, usuarioInformacion } from "./index.js"

export const cargarSeccionCaja=()=>{
    cargarMetodosPago()
}

const cargarMetodosPago=async ()=>{
    // Selecciona el contenedor y lo vacia
    const tablaArqueoCaja = document.getElementById('seleccionCaja__tablaSaldos')!
    tablaArqueoCaja.innerHTML=``

    if(metodosPago.length<1){
        tablaArqueoCaja.innerHTML='<div> No se encontraron medios de pago</div>'
        return
    }
    const fragmento = document.createDocumentFragment()
    metodosPago.forEach((metodo)=>{
        if(!metodo.estado) return // Si el metodo no tiene estado "true" entonces pasa al siguiente
        const metodoPagoDIV = document.createElement('div')
        metodoPagoDIV.innerHTML=`
        <div class="seleccionCaja__tablaSaldos__fila">
            <div class="seleccionCaja__tablaSaldos__metodo">${metodo.nombre}</div>
            <input class="inputRegistener1 seleccionCaja__tablaSaldos__input" value="$ 500.000">
            <input class="inputRegistener1 seleccionCaja__tablaSaldos__input" value="$ 700.000">
            <div>$ 800.000</div>
            <div>-$ 100.000</div>
        </div>
        `
        fragmento.appendChild(metodoPagoDIV)
    })
    tablaArqueoCaja.appendChild(fragmento)
}

