
// Interfaces
import { CategoriaI } from "../../../models/interfaces/categorias.js"
import { producto } from "../../../models/interfaces/producto.js"
import { variante } from "../../../models/interfaces/variante.js"

// Servicios
import { obtenerProductos } from "../services/productosAPI.js"
import { actualizarVariante, aplicarVenta } from "../services/variantesAPI.js"


import { mostrarMensaje } from "../helpers/mostrarMensaje.js"
import { usuarioInformacion } from "../registener/index.js"
import { registrarVenta } from "../services/registroVentasAPI.js"

let productosVenta:producto[]

class carrito{
    constructor(private SKU:string[],private cantidad:number[],private precio:number[],private nombre:string[]){}

    cambiarCarrito(SKUVariante:string,cantidad:number,precio:number,nombre:string){
        let ubicacion:number = this.SKU.findIndex(SKU=>SKU===SKUVariante)

        if(ubicacion===-1){//Si el producto no se encuentra en el carrito entonces lo agrega
            this.SKU.push(SKUVariante)
            this.cantidad.push(cantidad)
            this.precio.push(precio)
            this.nombre.push(nombre)
            cargarCarrito() // Refleja los cambios en el resumen del DOM
            calcularTotal()
            return cantidad
        }else{ //Si el producto se encuentra en el carro entonces simplemente agrega la cantidad ingresada
            this.cantidad[ubicacion]=this.cantidad[ubicacion]+cantidad;

            if(this.cantidad[ubicacion]===0) { // Si la cantidad queda en cero entonces elimina el producto del carro
                this.eliminarProducto(this.SKU[ubicacion])
                cargarCarrito() // Refleja los cambios en el resumen del DOM
                calcularTotal()
                return 0
            } 
        }
        cargarCarrito() // Refleja los cambios en el resumen del DOM
        calcularTotal()
        return this.cantidad[ubicacion]
    }

    eliminarProducto(SKUVariante:string):void{
        let ubicacion:number = this.SKU.findIndex(SKU=>SKU===SKUVariante)
        this.SKU.splice(ubicacion, 1);
        this.cantidad.splice(ubicacion, 1);
        this.precio.splice(ubicacion, 1);
    }
    verCarrito(){
        const carrito:[
            string[],
            number[],
            number[],
            string[]]=[
            this.SKU,
            this.cantidad,
            this.precio,
            this.nombre
        ]

        return carrito
    }
    verCantidadProducto(producto:producto){
        const variantesSKU:Object[] = (producto.variantes as variante[]).map(variante=>variante.SKU!)
        let cantidadTotal = 0
        variantesSKU.map(varianteSKU=>cantidadTotal=cantidadTotal + this.verCantidadVariante(varianteSKU.toString()))
        return cantidadTotal
    }
    verCantidadVariante(SKUVariante:string){
        let ubicacion:number = this.SKU.findIndex(SKU=>SKU===SKUVariante)
        if(ubicacion===-1) return 0
        else return this.cantidad[ubicacion]
    }

    devolverTotal(){
        // Calcular total
        let total:number = 0
        for (let i = 0; i < this.SKU.length; i++) {
            const precio = this.cantidad[i] as number
            const cantidad = this.precio[i] as number
            total = total + precio*cantidad
        }
        return total
    }
    
    reiniciarCarrito(){ // Reinicia el carrito
        this.SKU=[]
        this.cantidad=[]
        this.precio=[]
        this.nombre=[]
    }

}

let carrito1 = new carrito([],[],[],[])

const botonesDesplazamiento=()=>{
    // Boton para cargar la seleccion de productos
    const contenedorSeleccionProductos = document.getElementById('seleccionProductos__div-contenedorSeleccionarProductos')!
    const contenedorPago = document.getElementById('seleccionProductos__div-pago')!
    const botonIrSeleccionProductos = document.getElementById('botonIrSeleccionProductos')!
    const botonIrPago = document.getElementById('botonIrPago')!

    // Boton para cargar la seccion de pago
    botonIrPago.onclick=()=>{
        contenedorPago.scrollIntoView(({block: 'start' ,behavior:'smooth'}));
        botonIrPago.classList.add('nodisponible')
        botonIrSeleccionProductos.classList.remove('nodisponible')
    }

    // Boton para cargar la seleccion de productos
    botonIrSeleccionProductos.onclick=()=>{
        contenedorSeleccionProductos.scrollIntoView(({block: 'start' ,behavior:'smooth'}));
        botonIrPago.classList.remove('nodisponible')
        botonIrSeleccionProductos.classList.add('nodisponible')
    }
}

const inputBusqueda=()=>{
    // Escucha si el usuario busca un SKU especifico
    const inputBuscarSKU = document.getElementById('seleccionProductos__input-buscarSKU')! as HTMLInputElement
    inputBuscarSKU.value = sessionStorage.getItem('SKUBuscado')||''
    inputBuscarSKU.addEventListener('input',()=>{
        sessionStorage.setItem('SKUBuscado',inputBuscarSKU.value)
        cargarVentaPublico()
    })
    /////////////////////

    // Escucha si el usuario busca una palabra especifica
    const inputBuscarProducto = document.getElementById('seleccionProductos__input-buscar')! as HTMLInputElement
    inputBuscarProducto.value=sessionStorage.getItem('palabraBuscada')||''
    inputBuscarProducto.addEventListener('input',()=>{
        sessionStorage.setItem('palabraBuscada', inputBuscarProducto.value ); // Si no existe, lo crea; si existe, lo actualiza
        cargarVentaPublico()
    })
    /////////////////////
}

const checkboxAgrupadores=()=>{
    // Escucha si el usuario elige entre agrupar o no los productos en categorias
    const botonAgruparCategorias = document.getElementById('seleccionProductos__botonAgruparCategorias')! as HTMLInputElement
    botonAgruparCategorias.checked = sessionStorage.getItem('agruparPorCategorias')==='true'

    botonAgruparCategorias.onclick=()=>{
        const esActivo = sessionStorage.getItem('agruparPorCategorias')==='true'; // Verifica el estado actual

        if(esActivo) sessionStorage.setItem('agruparPorCategorias','false') // Si estaba activo, lo desactiva
        else sessionStorage.setItem('agruparPorCategorias','true') // Si no estaba activo, lo activa

        cargarVentaPublico()
    }
    /////////////////////

    // Escucha si el usuario elige ver solo las variantes o agrupadas por producto
    const botonSoloVariantes = document.getElementById('seleccionProductos__botonSoloVariantes')! as HTMLInputElement
    botonAgruparCategorias.checked = sessionStorage.getItem('soloVariantes')==='true'

    botonSoloVariantes.onclick=()=>{
        const esActivo = sessionStorage.getItem('soloVariantes')==='true'; // Verifica el estado actual

        if(esActivo) sessionStorage.setItem('soloVariantes','false') // Si estaba activo, lo desactiva
        else sessionStorage.setItem('soloVariantes','true') // Si no estaba activo, lo activa

        cargarVentaPublico()
    }
    /////////////////////
}

const botonesModosPago=()=>{
    // Carga y le da funcion a los botones de medios de pago
    const contenedorMediosPago = document.getElementById('div-pago__metodoPago')!
    const mediosPago = usuarioInformacion!.preferencias.metodosPago
    const fragmento = document.createDocumentFragment()

    contenedorMediosPago.innerHTML='<h4>Modo de pago</h4>' // Vacia el contenedor

    // Primero crea un input inicial para medios de pago no contemplados
    const inputMedioPago = document.createElement('input')
    inputMedioPago.className='inputRegistener1'
    inputMedioPago.placeholder='Ingrese un metodo'

    // Cuando se realiza un cambio en le input:
    inputMedioPago.addEventListener('input',()=>{
        const esVacio = inputMedioPago.value?false:true
        contenedorMediosPago.querySelectorAll('*').forEach(opcionMedio=>opcionMedio.classList.remove('boton__activo')) // Desactiva cualquier boton activo previamente
        if(esVacio){ // Si el input esta vacio elimina su estado activo
            inputMedioPago.classList.remove('boton__activo')
            sessionStorage.setItem('metodoSeleccionado','') 
        }else{ // Si el input no esta vacio lo coloca en estado activo y almacena su valor 
            inputMedioPago.classList.add('boton__activo')
            sessionStorage.setItem('metodoSeleccionado',inputMedioPago.value) 
        }
        calcularTotal() // Vuelve a calcular el total del carrito
    })

    fragmento.appendChild(inputMedioPago) // Agrega el input al fragmento

    // Recorre los medios de pago que posee el usuario en sus preferencias
    mediosPago.forEach(medioPago=>{ 

        // Crea un nuevo boton y le asigna todas las propiedades
        const botonMedioPago = document.createElement('button') 
        botonMedioPago.classList.add('botonRegistener3')
        botonMedioPago.textContent=medioPago

        // Si se hace click en el boton:
        botonMedioPago.onclick=()=>{
            const esActivo = botonMedioPago.classList.contains('boton__activo')
            if(esActivo){
                botonMedioPago.classList.remove('boton__activo') // Desactiva el estado de actividad
                sessionStorage.setItem('metodoSeleccionado','') // Vacia la variable que contiene el metodo de pago
            }else{
                inputMedioPago.value='' // Vacia el input inicial
                contenedorMediosPago.querySelectorAll('*').forEach(opcionMedio=>opcionMedio.classList.remove('boton__activo')) // Desactiva cualquier boton activo previamente
                sessionStorage.setItem('metodoSeleccionado',medioPago) // Se almacena el medio seleccionado
                botonMedioPago.classList.add('boton__activo') // Se refleja visualmente que el metodo esta activo
            }
            calcularTotal() // Vuelve a calcular el total del carrito
        }
        fragmento.appendChild(botonMedioPago) // Agrega el boton al fragmento
    })
    contenedorMediosPago.appendChild(fragmento) // Agrega el fragmento al DOM
    /////////////////////
}

const botonesModificacionPago=()=>{
    // Carga y le da funcion a los botones de modificacion de pago
    const contenedorModificacion = document.getElementById('div-pago__modificacion')!
    let modificacionPago = usuarioInformacion!.preferencias.modificacionesPago
    const fragmentoModificacion = document.createDocumentFragment()

    contenedorModificacion.innerHTML='<h4>Modificacion</h4>' // Vacia el contenedor

    // Primero crea un input inicial para modificadores de pago no contemplados
    const inputModificacion = document.createElement('input')
    inputModificacion.className='inputRegistener1'
    inputModificacion.placeholder='Ingrese un porcentaje de descuento'
    inputModificacion.type='number'
    
    // Cuando se realiza un cambio en le input:
    inputModificacion.addEventListener('input',()=>{
        const esVacio = Number(inputModificacion.value)?false:true
        contenedorModificacion.querySelectorAll('*').forEach(opcionModificacion=>opcionModificacion.classList.remove('boton__activo')) // Desactiva cualquier boton activo previamente
        if(esVacio){ // Si el input esta vacio, o no es valido, elimina su estado activo
            inputModificacion.classList.remove('boton__activo')
            sessionStorage.setItem('modificacionSeleccionado','') 
            sessionStorage.setItem('modificacionSeleccionadoNombre','') 
        }else{ // Si el input no esta vacio lo coloca en estado activo y almacena su valor 
            inputModificacion.classList.add('boton__activo')
            sessionStorage.setItem('modificacionSeleccionado',`${1-Number(inputModificacion.value)/100}`) 
            sessionStorage.setItem('modificacionSeleccionadoNombre',`Ingresado manualmente`) 
        }
        calcularTotal() // Vuelve a calcular el total del carrito
    })

    fragmentoModificacion.appendChild(inputModificacion) // Agrega el input al fragmento

    // Recorre los modificadores de pago que posee el usuario en sus preferencias
    modificacionPago.forEach(modificacionPago=>{ 
        const [nombre,modificacion] = modificacionPago.split('&',2)
        if(!nombre) return
        if(!modificacion) return

        // Crea un nuevo boton y le asigna todas las propiedades
        const botonModificacion = document.createElement('button') 
        botonModificacion.classList.add('botonRegistener3')
        botonModificacion.textContent=nombre

        // Si se hace click en el boton:
        botonModificacion.onclick=()=>{
            const esActivo = botonModificacion.classList.contains('boton__activo')
            if(esActivo){
                botonModificacion.classList.remove('boton__activo') // Desactiva el estado de actividad
                sessionStorage.setItem('modificacionSeleccionado','') // Vacia la variable que contiene el metodo de pago
                sessionStorage.setItem('modificacionSeleccionadoNombre','') // Vacia la variable que contiene el metodo de pago
            }else{
                inputModificacion.value='' // Vacia el input inicial
                contenedorModificacion.querySelectorAll('*').forEach(opcionModificador=>opcionModificador.classList.remove('boton__activo')) // Desactiva cualquier boton activo previamente
                sessionStorage.setItem('modificacionSeleccionado',`${1-Number(modificacion)/100}`) // Se almacena el modificador seleccionado
                sessionStorage.setItem('modificacionSeleccionadoNombre',nombre) // Se almacena el modificador seleccionado
                botonModificacion.classList.add('boton__activo') // Se refleja visualmente que el metodo esta activo
            }
            calcularTotal() // Vuelve a calcular el total del carrito
        }

        fragmentoModificacion.appendChild(botonModificacion) // Agrega el boton al fragmento
    })
    contenedorModificacion.appendChild(fragmentoModificacion) // Agrega el fragmento al DOM
    /////////////////////
}

const contenedorVuelto=()=>{
    // Le da la funcion al input del pago 1 para calcular el vuelto
    const pago1Input = document.getElementById('div-pago__div-total__div-pago1')! as HTMLInputElement
    pago1Input.addEventListener('input',()=>{
        // Obtiene y elimina cualquier carácter que no sea número o punto decimal
        let value = pago1Input.value.replace(/[^0-9]/g, '');  // Elimina cualquier carácter no numérico
        if (value) {
            const valueNumerico = Number(value) / 100
            value = parseFloat(valueNumerico.toString()).toFixed(2);     // Formatea a decimales
            pago1Input.value = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value));
        } else {
            pago1Input.value = '';  // Restablece si no hay números
        }
        calcularTotal() // Vuelve a calcular el total
    })
}

const cargarBotonConfirmar=()=>{
    const botonConfirmar = document.getElementById('div-pago__confirmar__boton')! as HTMLButtonElement
    const textAreaObervacion = document.getElementById('div-pago__confirmar__observacion')! as HTMLTextAreaElement

    botonConfirmar.onclick=async ()=>{
        const total = Number(sessionStorage.getItem('total'))
        const pago1 = Number(sessionStorage.getItem('pago1'))||0
        const pago2 = Number(sessionStorage.getItem('pago2'))||0
        const metodo1 = sessionStorage.getItem('metodoSeleccionado')
        const metodo2 = sessionStorage.getItem('metodoSeleccionado2')||''
        const descuento = Number(sessionStorage.getItem('descuento'))||0;
        const modificacionNombre = sessionStorage.getItem('modificacionSeleccionadoNombre')||'';
        const observacion = textAreaObervacion.value
        const carrito = carrito1.verCarrito();

        if(!total||!metodo1) return;

        registrarVenta(total,metodo1,'Exitoso',pago1,pago2,metodo2,'',descuento,modificacionNombre,observacion,carrito);

        const respuesta = await aplicarVenta(carrito)
        if(respuesta==0) { // Si todo sale bien:
            carrito1.reiniciarCarrito() // Vacia el carrito
            sessionStorage.setItem('metodoSeleccionado','') // Reinicia el valor de la eleccion de metodo de pago
            sessionStorage.setItem('modificacionSeleccionado','') // Reinicia el valor de la eleccion de modificacion
            textAreaObervacion.value='' // Reinicia el valor de la observacion de la compra
            document.getElementById('botonIrSeleccionProductos')!.click() // Desplaza la ventana a la seleccion de productos
            cargarVentaPublico() // Vuelve a cargar la seccion para aplicar los cambios
        }
    }
}

const cargarBotonesVentaPublico=()=>{
    botonesDesplazamiento()
    inputBusqueda()
    checkboxAgrupadores()
    botonesModosPago()
    botonesModificacionPago()
    contenedorVuelto()
    cargarBotonConfirmar()
}



export const cargarVentaPublico =async()=>{
    // Define los query params para enviarlos en el fetch y asi filtrar los productos
    const palabraBuscada = sessionStorage.getItem('palabraBuscada') || '';
    const esAgruparPorCategoria = sessionStorage.getItem('agruparPorCategorias')==='true';
    const esSoloVariantes = sessionStorage.getItem('soloVariantes')==='true';
    const SKUBuscado = sessionStorage.getItem('SKUBuscado')||''

    const respuesta = await obtenerProductos('','100000000000','','',palabraBuscada,'','','true',SKUBuscado)
    productosVenta = respuesta.productos
    const categoriasCompletas = respuesta.categoriasCompletas
    
    const nombreCategorias:string[] = categoriasCompletas.map(categoria=>categoria.nombre)

    cargarVariantesVentaDOM(productosVenta,nombreCategorias,esAgruparPorCategoria,esSoloVariantes)
    cargarVariantesFavoritosDOM(nombreCategorias)
    cargarCarrito()
    cargarBotonesVentaPublico()
    calcularTotal()
}

const cargarCarrito=()=>{
    // Carga el carrito en el resumen de la venta al publico
    const contenedorSeleccionProductosResumen = document.getElementById('seleccionProductos__div-resumen')
    const tablaResumen = document.getElementById('seleccionProductos__div-resumen__table')! as HTMLTableElement
    const carrito = carrito1.verCarrito();
    const contenedorPrecioTotal = document.getElementById('seleccionProductos__div-resumen__total')!
    
    tablaResumen.querySelector('tbody')!.innerHTML=''; // Vacia todas las filas
    
    // Agrega los productos del carrito
    for (let i = 0; i < carrito[0].length; i++) {
        const nuevaFila = tablaResumen.querySelector('tbody')!.insertRow()

        const SKU = nuevaFila.insertCell(0)
        SKU.textContent=carrito[0][i] as string
        SKU.classList.add('seleccionProductos__div-resumen__table__nombre')

        const nombre = nuevaFila.insertCell(1)
        nombre.textContent=carrito[3][i].toString()
        nombre.classList.add('seleccionProductos__div-resumen__table__nombre')

        nuevaFila.insertCell(2).textContent=carrito[1][i].toString()
        nuevaFila.insertCell(3).textContent=`$ ${carrito[2][i].toLocaleString('es-AR')}`
    }

    // Calcular total
    const total = carrito1.devolverTotal()
    
    // Inserta el total
    contenedorPrecioTotal.lastElementChild!.textContent=`$ ${total.toLocaleString('es-AR')}`


}

const calcularTotal=()=>{
    // Calcula el total y lo muestra en la seccion de pago
    const totalDIV = document.getElementById('div-pago__div-total__div-total')!
    const botonConfirmar = document.getElementById('div-pago__confirmar__boton')! as HTMLButtonElement

    new Promise<number>((resolve, reject) => {
        // Obtiene el metodo de pago
        const metodoSeleccionado = sessionStorage.getItem('metodoSeleccionado')
        if(!metodoSeleccionado) reject() // Verifica que no este vacio
        
        // Obtiene la modificacion del pago
        let modificacionPago = sessionStorage.getItem('modificacionSeleccionado')
        if(!modificacionPago) modificacionPago='1' // Si esta vacio le da un valor 1 por default
        if(isNaN(Number(modificacionPago))) reject() // Verifica que sea un numero valido

        // Coloca el total
        const subtotal = carrito1.devolverTotal()
        const descuento = subtotal*Number(modificacionPago) - subtotal
        const total = subtotal+descuento // Calcula el total con la modificacion aplicada
        sessionStorage.setItem('descuento',descuento.toString())
        sessionStorage.setItem('total',total.toString())
        sessionStorage.setItem('pago1',total.toString())
        if(sessionStorage.getItem('metodoSeleccionado')==='combinado'){} // TODO Se tiene que especificar el pago 1 y 2
        resolve(total)

    })
    .then((total)=>{
        // Coloca el total en el DOM
        totalDIV.textContent= `$ ${total.toLocaleString('es-AR')}`
        botonConfirmar.disabled = false
        botonConfirmar.classList.remove('nodisponible')

        // Calcula el vuelto, si existe
        let pago1 = Number((document.getElementById('div-pago__div-total__div-pago1')! as HTMLInputElement).value.replace(/[^0-9]/g, ''))/100 // Obtiene el valor del input, remplaza cualquier variable que no sea un numero y luego convierte la variable a "number"
        const contenedorVuelto = document.getElementById('div-pago__div-total__div-vuelto')!
        if(pago1) contenedorVuelto.textContent = `$ ${(pago1-total).toLocaleString('es-AR')}`
        else contenedorVuelto.textContent = `$ 0`

    })
    .catch(()=>{
        // Si no se cumplieron todas las condiciones entonces coloca un cero en el total
        totalDIV.textContent= `$ 0`
        botonConfirmar.disabled = true
        botonConfirmar.classList.add('nodisponible')

    })

}

const cargarVariantesVentaDOM =(productos:producto[],nombreCategorias:string[],esMostrarCategorias:boolean,esSoloVariantes:boolean)=>{
    const contenedor = document.getElementById('seleccionProductos__div-productos')!;
    let productosDIV: HTMLDivElement[][] = Array.from({ length: nombreCategorias.length }, () => []); // Inicializa la variable con una longitud igual a la longitud del array de cateogirasId
    const fragmento = document.createDocumentFragment()

    // Agrega los productos
    if(esSoloVariantes) productosDIV = crearVariantesCompletasDOM(productos,nombreCategorias,productosDIV)
    else productosDIV = crearVariantesDOM(productos,nombreCategorias,productosDIV)

    // Coloca los productos en las categorias
    if(esMostrarCategorias){ // Recorre los productos y crea una barra deslizadora que contenga los productos de una misma categoria

        for (const i in productosDIV) {


            if(productosDIV[i].length>0){

                // Se crea el contenedor de la categoria
                const categoriaDIV = document.createElement('div')


                // Le asigna el titulo, el cual funcionara como boton para mostrar o esconder los productos de esa categoria
                const titulo = document.createElement('div')
                titulo.classList.add('div-productos__div-titulo')
                titulo.innerHTML=`
                <h3>${nombreCategorias[i]}</h3>
                <h3>${productosDIV[i].length}</h3>
                `
                titulo.onclick=(event)=>{ // Cuando se hace click la categoria alterna la visibilidad de los productos que contiene
                    event.stopPropagation()
                    if(esSoloVariantes) categoriaDIV.querySelectorAll('.ventaPublico__div-varianteCompleta').forEach(productoDIV=>productoDIV.classList.toggle('noActivo'))
                    else categoriaDIV.querySelectorAll('.ventaPublico__div-producto').forEach(productoDIV=>productoDIV.classList.toggle('noActivo'))
                }
                categoriaDIV.appendChild(titulo)

                // Asigna un indice al principio de cada categoria antes de agregar variantes
                if(esSoloVariantes){ // Verifica que no este vacia
                    const indiceHTML= document.createElement('div')
                    indiceHTML.classList.add('ventaPublico__div-varianteCompleta')
                    indiceHTML.classList.add('noActivo')
                    indiceHTML.innerHTML=`
                    <div></div>
                    <div>SKU</div>
                    <div>Nombre</div>
                    <div></div>
                    <i class="fa-solid fa-cart-shopping" title="Cantidad seleccionada"></i>
                    <i class="fa-solid fa-boxes-stacked" title="Stock"></i>
                    <div>Precio</div>
                    `;
                    categoriaDIV.appendChild(indiceHTML)
                }

                productosDIV[i].forEach(productoDIV=>{
                    categoriaDIV.appendChild(productoDIV)
                })
                fragmento.appendChild(categoriaDIV)
            }
        }
    }else{ // Agrega todos los productos al fragmento
        if(esSoloVariantes){ // Muestra las variantes y deja escondido el producto
            // Agrega el indice antes de los productos
            const indiceHTML= document.createElement('div')
            indiceHTML.classList.add('ventaPublico__div-varianteCompleta')
            indiceHTML.innerHTML=`
            <div></div>
            <div>SKU</div>
            <div>Nombre</div>
            <div></div>
            <i class="fa-solid fa-cart-shopping" title="Cantidad seleccionada"></i>
            <i class="fa-solid fa-boxes-stacked" title="Stock"></i>
            <div>Precio</div>
            `;
            fragmento.appendChild(indiceHTML)

            for (const i in productosDIV) {
                productosDIV[i].forEach(productoDIV=>{
                    productoDIV.classList.remove('noActivo')
                    fragmento.appendChild(productoDIV)
                })
            }

        }else{ // Muestra el producto y deja escondida las variantes
            for (const i in productosDIV) {

                // Asigna un indice al principio de cada categoria antes de agregar productos
                if(productosDIV[i].length>0){ // Verifica que no este vacia
                    const indiceHTML= document.createElement('div')
                    indiceHTML.classList.add('ventaPublico__div-varianteCompleta')
                    indiceHTML.classList.add('noActivo')
                    indiceHTML.innerHTML=`
                    <div></div>
                    <div>SKU</div>
                    <div>Nombre</div>
                    <div></div>
                    <i class="fa-solid fa-cart-shopping" title="Cantidad seleccionada"></i>
                    <i class="fa-solid fa-boxes-stacked" title="Stock"></i>
                    <div>Precio</div>
                    `;
                    fragmento.appendChild(indiceHTML)
                }
                // Agrega los productos de la categoria
                productosDIV[i].forEach(productoDIV=>{
                    (productoDIV.firstChild! as HTMLDivElement).classList.remove('noActivo')
                    fragmento.appendChild(productoDIV)
                })
            }
        }
    }

    // Agrega el fragmento al contenedor de productos

    contenedor.innerHTML='' // Vacia el contenedor antes de agregar los nuevos productos
    contenedor.appendChild(fragmento)

}

const cargarVariantesFavoritosDOM=async (nombreCategorias:string[])=>{

    let productosDIV: HTMLDivElement[][] = Array.from({ length: nombreCategorias.length }, () => []); // Inicializa la variable con una longitud igual a la longitud del array de cateogirasId

    // Busca los productos
    const respuesta = await obtenerProductos('','100000000000','','','','','','true','')
    const productos = respuesta.productos

    // Busca las variantes favoritas
    productosDIV = crearVariantesCompletasDOM(productos,nombreCategorias,productosDIV,true)

    // Las coloca en el DOM
    const fragmento = document.createDocumentFragment()
    const contenedorVariantesFavoritas = document.getElementById('seleccionProductos__div-productosFav')!
    for (const i in productosDIV) productosDIV[i].forEach((varianteDIV)=>{
        // Antes de agregar las variantes a la ventana de "variantes favoritas" realiza modificaciones de las mismas

        const varianteSKU = varianteDIV.querySelector('.div-productos__div-SKU')!.textContent!

        // Oculta el SKU y la cantidad
        varianteDIV.className='ventaPublico__div-varianteFavorita'
        varianteDIV.querySelector('.div-productos__div-SKU')!.classList.add('noActivo')
        varianteDIV.querySelector('.div-productos__div-cantidad')!.classList.add('noActivo')

        // Si se hace click en la estrella para eliminar de elementos favoritos entonces lo refleja en la variante que se encuentra en la ventana de "seleccionar productos"
        const botonAlternarFavorito = varianteDIV.firstElementChild!
        botonAlternarFavorito.addEventListener('click',()=>{  
            document.getElementById(varianteDIV.id)!.firstElementChild!.classList.remove('esVarianteFavorito')
        }) 

        // Si se agrega cantidad refleja en la variante que se encuentra en la ventana de "seleccionar productos"
        const botonAgregarCantidad = botonAlternarFavorito.nextElementSibling!.nextElementSibling!
        botonAgregarCantidad.addEventListener('click',()=>{ 
            document.getElementById(varianteDIV.id)!.querySelector('.div-productos__div-cantidad')!.textContent=carrito1.verCantidadVariante(varianteSKU).toString()
        }) 

        // Si se resta cantidad refleja en la variante que se encuentra en la ventana de "seleccionar productos"
        const botonRestarCantidad = botonAgregarCantidad.nextElementSibling!
        botonRestarCantidad.addEventListener('click',()=>{ 
            document.getElementById(varianteDIV.id)!.querySelector('.div-productos__div-cantidad')!.textContent=carrito1.verCantidadVariante(varianteSKU).toString()
        }) 

        fragmento.appendChild(varianteDIV)
    })
    contenedorVariantesFavoritas.innerHTML='<h2>Productos favoritos</h2>' // Vacia el contenedor
    contenedorVariantesFavoritas.appendChild(fragmento)


}

const crearVariantesCompletasDOM =(productos:producto[],nombreCategorias:string[],productosDIV: HTMLDivElement[][],esFavorito:boolean=false)=>{
    // Crea los contenedores de las variantes completas y las agrupa en un array separadas por sus categorias
    
    productos.forEach(producto=>{
        // Verifica el indice de la categoria del producto en el array de categorias
        const indiceCategoria:number = nombreCategorias.indexOf((producto.categoria as CategoriaI).nombre);

        (producto.variantes as variante[]).forEach(variante => {
            
            if(esFavorito&&variante.esFavorito!==true) { // Si se busca solo las variantes favoritas, saltea las que no cumplen dicha condicion
                return
            }

            // Crea el contenedor general de la variante
            const varianteDIV = document.createElement('div')
            varianteDIV.id=variante._id!.toString();
            varianteDIV.classList.add('ventaPublico__div-varianteCompleta')
            varianteDIV.classList.add('noActivo')

            // Boton para agregar a favoritos el producto
            const botonFavorito = document.createElement('button')
            botonFavorito.className=`botonAgregarVarianteFavorito ${variante.esFavorito?'esVarianteFavorito':''}`;
            botonFavorito.innerHTML=`
            <i class="fa-solid fa-star"></i>
            `
            botonFavorito.onclick=async ()=>{
                botonFavorito.classList.toggle('esVarianteFavorito')
                const formData = new FormData()
                formData.append('esFavorito',botonFavorito.classList.contains('esVarianteFavorito').toString());
                formData.append('stock',variante.stock.toString());
                await actualizarVariante(formData,variante._id!.toString());
                cargarVariantesFavoritosDOM(nombreCategorias)
            }
            varianteDIV.appendChild(botonFavorito)
            
            // SKU del producto
            const SKUProductoDIV = document.createElement('div')
            SKUProductoDIV.classList.add('div-productos__div-SKU')
            SKUProductoDIV.textContent=variante.SKU // SKU de la variante
            varianteDIV.appendChild(SKUProductoDIV)


            // Nombre del producto y boton para sumar cantidad
            const nombreProducto = document.createElement('button')
            nombreProducto.classList.add('botonRegistener3')
            nombreProducto.textContent=producto.nombre // Le asigna el nombre del producto
            nombreProducto.onclick=()=>{
                const varianteCantidad = carrito1.cambiarCarrito(variante.SKU,1,producto.precio,producto.nombre);
                varianteDIV.querySelector('.div-productos__div-cantidad')!.textContent = varianteCantidad.toString();
            }
            varianteDIV.appendChild(nombreProducto)

            // Boton para restar la variante al carrito
            const botonRestar = document.createElement('button')
            botonRestar.classList.add('botonRegistener3')
            botonRestar.innerHTML=`<i class="fa-solid fa-minus"></i>`
            botonRestar.onclick=()=>{
                const varianteCantidad = carrito1.cambiarCarrito(variante.SKU,-1,producto.precio,producto.nombre);
                varianteDIV.querySelector('.div-productos__div-cantidad')!.textContent = varianteCantidad.toString();
            }
            varianteDIV.appendChild(botonRestar)

            // Cantidad de la variante en el carrito
            const cantidadDIV= document.createElement('div')
            cantidadDIV.className="div-productos__div-cantidad"
            cantidadDIV.textContent=carrito1.verCantidadVariante(variante.SKU)!.toString()
            varianteDIV.appendChild(cantidadDIV)

            // Stock actual de la variante
            const stockDIV= document.createElement('div')
            stockDIV.textContent=variante.stock.toString()
            varianteDIV.appendChild(stockDIV)

            // Precio del producto
            const precioDIV = document.createElement('div')
            precioDIV.className="div-productos__div-precio"
            precioDIV.textContent=(Number(producto.precio)).toLocaleString('es-AR')
            varianteDIV.appendChild(precioDIV)



            // Agrega el div al array para luego colocarlo en su respectiva categoria
            productosDIV[indiceCategoria].push(varianteDIV)
        });
    })  

    return productosDIV
}

const crearVariantesDOM=(productos:producto[],nombreCategorias:string[],productosDIV: HTMLDivElement[][])=>{

    productos.forEach(producto=>{
        // Calcula el stock del producto
        let stockTotal:number = 0
        producto.variantes.forEach(variante => stockTotal = (variante as variante).stock+stockTotal);

        // Crea el contenedor general del producto
        const productoDIV = document.createElement('div')
        productoDIV.onclick=()=>productoDIV.querySelectorAll(".ventaPublico__div-variantes").forEach(varianteDIV=>varianteDIV.classList.toggle('noActivo')) // Alterna la visibilidad de las variantes del producto seleccionado


        // Crea el contenedor de la informacion del producto
        const productoInformacionDIV = document.createElement('div')
        productoInformacionDIV.classList.add('noActivo')
        productoInformacionDIV.classList.add('ventaPublico__div-producto')
        productoInformacionDIV.classList.add('botonRegistener3')
        productoInformacionDIV.innerHTML=`
        <i class="fa-solid fa-bars"></i>
        <div>${producto.nombre}</div>
        <div class="div-productos__div-cantidad" >${carrito1.verCantidadProducto(producto)!.toString()}</div>
        <div>${stockTotal}</div>
        <div class="div-productos__div-precio" >$ ${(Number(producto.precio)).toLocaleString('es-AR')}</div>
        `
        productoDIV.appendChild(productoInformacionDIV);

        // Crea el indice para la seccion
        const indiceDIV= document.createElement('div')
        indiceDIV.classList.add('ventaPublico__div-variantes');
        indiceDIV.classList.add('noActivo');
        indiceDIV.innerHTML=`
        <div> </div>
        <i class="fa-solid fa-palette"></i>
        <i class="fa-solid fa-ruler-horizontal"></i>
        <div>SKU</div>
        <i class="fa-solid fa-cart-shopping" title="Cantidad seleccionada"></i>
        <i class="fa-solid fa-boxes-stacked" title="Stock"></i>
        `;
        productoDIV.appendChild(indiceDIV);


        (producto.variantes as variante[]).forEach(variante=>{
            const varianteDIV = document.createElement('div')
            varianteDIV.classList.add('ventaPublico__div-variantes')
            varianteDIV.classList.add('noActivo')
            varianteDIV.innerHTML=`
            
            <div class="div-productos__div-color ${variante.color}"></div>
            <div>${variante.talle}</div>
            <div>${variante.SKU}</div>
            <div></div>
            <div class="div-productos__div-varianteCantidad">${carrito1.verCantidadVariante(variante.SKU)}</div>
            <div>${variante.stock}</div>
            `;

            // Nombre del producto y boton para sumar cantidad
            const botonSumar = document.createElement('button')
            botonSumar.classList.add('botonRegistener3')
            botonSumar.classList.add('fa-solid')
            botonSumar.classList.add('fa-plus')
            botonSumar.onclick=(event)=>{
                event.stopPropagation()
                const varianteCantidad = carrito1.cambiarCarrito(variante.SKU,1,producto.precio,producto.nombre);
                varianteDIV.querySelectorAll('.div-productos__div-varianteCantidad')?.forEach(cantidadDIV=>cantidadDIV.textContent = varianteCantidad.toString())
                productoDIV.querySelectorAll('.div-productos__div-cantidad')?.forEach(cantidadDIV=>cantidadDIV.textContent = carrito1.verCantidadProducto(producto)!.toString())
            }
            varianteDIV.appendChild(botonSumar)

            // Boton para restar la variante al carrito
            const botonRestar = document.createElement('button')
            botonRestar.classList.add('botonRegistener3')
            botonRestar.classList.add('fa-solid')
            botonRestar.classList.add('fa-minus')
            botonRestar.onclick=(event)=>{
                event.stopPropagation()
                const varianteCantidad = carrito1.cambiarCarrito(variante.SKU,-1,producto.precio,producto.nombre);
                varianteDIV.querySelectorAll('.div-productos__div-varianteCantidad')?.forEach(cantidadDIV=>cantidadDIV.textContent = varianteCantidad.toString())
                productoDIV.querySelectorAll('.div-productos__div-cantidad')?.forEach(cantidadDIV=>cantidadDIV.textContent = carrito1.verCantidadProducto(producto)!.toString())
            }
            varianteDIV.appendChild(botonRestar)

            productoDIV.appendChild(varianteDIV)
        })


        // Verifica el indice de la categoria del producto en el array de categorias
        const indiceCategoria:number = nombreCategorias.indexOf((producto.categoria as CategoriaI).nombre)
        if(indiceCategoria===-1) mostrarMensaje('Error al encontrar la categoria del producto',true)

        // Agrega el div al array para luego colocarlo en su respectiva categoria
        productosDIV[indiceCategoria].push(productoDIV)
    })  

    return productosDIV
}

window.addEventListener('resize',()=>{

    const contenedores = document.querySelectorAll('.contenedorRegistener1') 
    contenedores.forEach(contenedor => {
        // Verifica que se encuentre activo el contenedor de venta al publico
        const ventaEsActivo = !contenedor.classList.contains('noActivo') &&  contenedor.id==='seleccionProductos' 
        if(ventaEsActivo) {
            document.getElementById('seleccionProductos__div-contenedorSeleccionarProductos')!.scrollIntoView({block:'start'}) // Mueve la vista del usuario a la seleccion de productos
            document.getElementById('botonIrSeleccionProductos')!.classList.add('nodisponible') // Desactiva el boton de ir a la seleccion de productos
            document.getElementById('botonIrPago')!.classList.remove('nodisponible') // Activa el boton de ir a la seccion de pago
        }
    });
    
})