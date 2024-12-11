import { usuario } from "../../../models/interfaces/usuario"
import { usuarioVerificado } from "../global"

export const cargarSeccionCaja=()=>{
    
}

const cargarMetodosPago=async (usuarioInformacion:usuario)=>{
    const metodos = usuarioInformacion.preferencias.metodosPago
    const tablaArqueoCaja = document.getElementById('seleccionCaja__tablaSaldos')!
    if(metodos.length<1){
        tablaArqueoCaja.innerHTML='<div> No se encontraron medios de pago</div>'
        return
    }
    metodos.forEach((metodo)=>{
        const contenedorFila = document.createElement('div')
        
    })
}

document.addEventListener('DOMContentLoaded',async ()=>{
    const usuarioInformacion = await usuarioVerificado
    if(!usuarioInformacion) return 
    cargarMetodosPago(usuarioInformacion)
})