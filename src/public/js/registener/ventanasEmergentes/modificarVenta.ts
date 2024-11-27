import { RegistroVentaI } from "../../../../models/interfaces/registroVentas.js"
import { convertirAInput } from "../../helpers/convertirElemento.js"
import { obtenerRegistro } from "../../services/registroVentasAPI.js"

export const ventanaModificarVenta =async (IDVenta:string)=>{
    const registro = await obtenerRegistro(IDVenta)
    if(!registro) return

    // Activa la ventana emergente para modificar la venta
    document.getElementById('ventanaEmergenteFondo')!.classList.remove('noActivo')
    document.getElementById('modificarVenta')!.classList.remove('noActivo')

    cargarInformacionGeneral(registro)
    cargarCarrito(registro)
    cargarInformacionPago(registro)

}

const cargarInformacionPago=(registro:RegistroVentaI)=>{
    console.log(registro);
    console.log(registro.descuentoNombre||'Descuento sin nombre');
    (document.getElementById('modificarVenta__infoPago__subtotal')! as HTMLDivElement).textContent=`$ ${((registro.total-(registro.descuento||0)).toLocaleString('es-AR'))}`;
    (document.getElementById('modificarVenta__infoPago__descuentoNombre')! as HTMLInputElement).value=registro.descuentoNombre||'Descuento sin nombre';
    (document.getElementById('modificarVenta__infoPago__descuento')! as HTMLInputElement).value=registro.descuento?.toString()||'0';
    (document.getElementById('modificarVenta__infoPago__total')! as HTMLDivElement).textContent=`$ ${registro.total.toLocaleString('es-AR')}`;
    (document.getElementById('modificarVenta__infoPago__metodo1')! as HTMLInputElement).value=registro.metodo1;
    (document.getElementById('modificarVenta__infoPago__pago1')! as HTMLInputElement).value=registro.pago1?.toString()||registro.total.toString();
    (document.getElementById('modificarVenta__infoPago__metodo2')! as HTMLInputElement).value=registro.metodo2||'';
    (document.getElementById('modificarVenta__infoPago__pago2')! as HTMLInputElement).value=registro.pago2?.toString()||'';

}   

const cargarInformacionGeneral=(registro:RegistroVentaI)=>{
    // Coloca la informacion de la venta en la ventana emergente
    document.getElementById('modificarVenta__h2')!.textContent=`ID: ${registro._id}`; // ID de la venta
    document.getElementById('modificarVenta__h3')!.textContent=`Estado: ${registro.estado}`; // Estado de la venta
    (document.getElementById('modificarVenta__infoGen__lugarVenta')! as HTMLInputElement).value=registro.lugarVenta||''; // Lugar de la venta
    (document.getElementById('modificarVenta__infoGen__fechaVenta')! as HTMLInputElement).value=new Date(registro.fechaVenta).toLocaleString('es-AR'); // Fecha de la venta
    (document.getElementById('modificarVenta__infoGen__vendedor')! as HTMLInputElement).value=registro.vendedor||''; // Vendedor 
    (document.getElementById('modificarVenta__infoGen__cliente')! as HTMLInputElement).value=registro.cliente?.toString()||''; // Cliente
    (document.getElementById('modificarVenta__infoGen__observacion')! as HTMLTextAreaElement).value=registro.observacion||''; // Obervacion
}

const cargarCarrito=(registro:RegistroVentaI)=>{
    // Coloca la informacion del carrito
    const indice = `<div id="modificarVenta__carrito__indice" class="modificarVenta__carrito__fila">
                        <div>Nombre</div>
                        <div class="modificarVenta__carrito__cantidad">Cantidad</div>
                        <div class="modificarVenta__carrito__precio">Precio</div>
                    </div>`
    const contenedorCarrito = document.getElementById('modificarVenta__carrito')! 
    contenedorCarrito.innerHTML=indice // Vacia el carrito
    
    // Llena el carrito con la informacion del registro
    const fragmento = document.createDocumentFragment()
    for (let i = 0; i < registro.carrito![0].length; i++) {
        const nombre = registro.carrito![3][i]
        const cantidad = registro.carrito![1][i]
        const precio = registro.carrito![2][i]
        const contenedorProducto = document.createElement('div')
        contenedorProducto.className="modificarVenta__carrito__fila"
        contenedorProducto.innerHTML=`
            <div class="modificarVenta__carrito__nombre">${nombre}</div>
            <div class="modificarVenta__carrito__cantidad">${cantidad}</div>
            <div class="modificarVenta__carrito__precio">${precio}</div>
        `
        fragmento.appendChild(contenedorProducto)
    }
    contenedorCarrito.appendChild(fragmento)
    cargarBotonesInput()
}

const cargarBotonesInput=()=>{
    const productosContenedores = document.querySelectorAll('.modificarVenta__carrito__fila')
    productosContenedores.forEach(productoContenedor=>{
        const elementosHijos = productoContenedor.querySelectorAll('*') as NodeListOf<HTMLDivElement>
        elementosHijos.forEach(elementoHijo=>{
            elementoHijo.onclick=()=>{
                if(elementoHijo.parentElement!.id==='modificarVenta__carrito__indice') return // Si el elemento pertenece al indice entonces no le asigna el evento
                
                let tipo = 'text'
                if(elementoHijo.className.includes('cantidad')||elementoHijo.className.includes('precio')) tipo= 'number' // Si el elemento es para asignar la cantidad o el precio el input debera ser del tipo number
                
                const elementoFinal = convertirAInput(elementoHijo,'','',tipo)
                elementoFinal.focus()
            }
        })
    })
}

const cargarBotonesRespuesta=()=>{
    const botonGuardar = document.getElementById('modificarVenta__respuesta__guardar')! as HTMLButtonElement
    const botonSalir = document.getElementById('modificarVenta__respuesta__salir')! as HTMLButtonElement

    botonGuardar.addEventListener('click',(event)=>{
        event.preventDefault()
        // TODO Enviar formulario para modificar la venta
    })

    botonSalir.addEventListener('click',(event)=>{
        event.preventDefault()
        // Desactiva la ventana emergente para modificar la venta
        document.getElementById('ventanaEmergenteFondo')!.classList.add('noActivo')
        document.getElementById('modificarVenta')!.classList.add('noActivo')
    })

}

document.addEventListener('DOMContentLoaded',()=>{
    cargarBotonesRespuesta()
})