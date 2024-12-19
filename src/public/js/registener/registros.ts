import { cargarRegistrosDOM } from "./registroVentas.js"

export const cargarSeccionRegistros=()=>{
    const contenedorRegistros = document.getElementById('registros') as HTMLElement
    const contenedorRegistroCaja = document.getElementById('registroCaja') as HTMLElement
    const botonVentas = document.getElementById('registros__botonVentas') as HTMLButtonElement  
    const botonArqueos = document.getElementById('registros__botonArqueos') as HTMLButtonElement

    botonVentas.onclick=()=>{
        contenedorRegistros.classList.add('noActivo')
        cargarRegistrosDOM()
    }
    botonArqueos.onclick=()=>{
        contenedorRegistros.classList.add('noActivo')
        contenedorRegistroCaja.classList.remove('noActivo')
    }
}