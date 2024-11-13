
import { ObjectId } from "mongoose"
import { CategoriaI } from "../../../models/interfaces/categorias.js"
import { producto } from "../../../models/interfaces/producto.js"
import { buscarCargarCategorias } from "../helpers/categorias.js"
import { obtenerProductos, solicitudEliminarProducto } from "../services/productosAPI.js"
import { agregarProductosDOM, alternarDisponibilidadProducto } from "./productos.js"
import { ventanaEmergenteModificarProducto } from "./ventanasEmergentes/modificarProducto.js"
import { preguntar } from "./ventanasEmergentes/preguntar.js"
import { mostrarMensaje } from "../helpers/mostrarMensaje.js"
import { variante } from "../../../models/interfaces/variante.js"



class carrito{
    constructor(private SKU:string[],private cantidad:number[],private precio:number[]){}

    cambiarCarrito(SKUVariante:string,cantidad:number,precio:number){
        let ubicacion:number = this.SKU.findIndex(SKU=>SKU===SKUVariante)

        if(ubicacion===-1){//Si el producto no se encuentra en el carrito entonces lo agrega
            this.SKU.push(SKUVariante)
            this.cantidad.push(cantidad)
            this.precio.push(precio)
            return cantidad
        }else{ //Si el producto se encuentra en el carro entonces simplemente agrega la cantidad ingresada
            this.cantidad[ubicacion]=this.cantidad[ubicacion]+cantidad;

            if(this.cantidad[ubicacion]===0) { // Si la cantidad queda en cero entonces elimina el producto del carro
                this.eliminarProducto(this.SKU[ubicacion])
                return 0
            } 
        }
        return this.cantidad[ubicacion]
    }

    eliminarProducto(SKUVariante:string):void{
        let ubicacion:number = this.SKU.findIndex(SKU=>SKU===SKUVariante)
        this.SKU.splice(ubicacion, 1);
        this.cantidad.splice(ubicacion, 1);
        this.precio.splice(ubicacion, 1);
    }
    verCarrito(){
        return [this.SKU,this.cantidad,this.precio]
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
    
    reiniciarCarrito(){ // Reinicia el carrito
        this.SKU=[]
        this.cantidad=[]
        this.precio=[]
    }
}

let carrito1 = new carrito([],[],[])

//Variables globales
let seleccionProductoCargada:boolean=false //Indica si el area de seleccion de productos esta cargada, util para volverla a cargar en caso de que se haya ingresado al area de modificacion de productos o si simplemente no esta cargada
let posicionUsuario:number = 0 //Indica en que ventana esta el usuario, se usa para lanzar ventanas de error


const contenedorProductos: HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__productos')!
export let productos:producto[]
let productosVenta:producto[]
export let categorias:CategoriaI[]|undefined

export const buscarCargarProductos =async()=>{ 
    // Define los query params para enviarlos en el fetch y asi filtrar los productos
    const params = new URLSearchParams(window.location.search);
    const desde = params.get('desde') || '0';
    const hasta = params.get('hasta') || '20';
    const precioMin = params.get('precioMin') || '';
    const precioMax = params.get('precioMax') || '';
    const palabraBuscada = params.get('palabraBuscada') || '';
    const categorias = params.get('categorias') || '';
    const ordenar = params.get('ordenar') || '';

    const respuesta = await obtenerProductos(desde,hasta,precioMin,precioMax,palabraBuscada,categorias,ordenar),
    productos = respuesta.productos


    await agregarProductosDOM(productos,contenedorProductos) // Si se encuentran productos para los parametros de busqueda entonces los agrega
    botonesSeccionProductos(productos) // Le da la funcion a los botones de cada producto
}

//Carga la seccion de seleccion de productos, se ejecuta cada vez que se hace click sobre la barra lateral para desplazarse a este mismo
function botonesSeccionProductos(productos:producto[]) {
    const botonAgregarProductos = document.getElementById('contenedorConfiguracionProductos__contenido__agregarProducto')! as HTMLButtonElement
    botonAgregarProductos.onclick=(event)=>{
        event.stopPropagation()
        ventanaEmergenteModificarProducto() // Abre la ventana emergente para modificar un producto, al no pasarle ningun ID la funcion crea un producto nuevo.
    }
    // Le da la funcion a los botones de alternar disponibilidad de un producto
    const botonesDisponibilidad: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.producto__disponibilidad')
    botonesDisponibilidad.forEach((boton)=>{
        boton.onclick =(event)=>{
            event.stopPropagation()
            const idProducto = boton.parentElement!.parentElement!.id!
            const estaDisponible = boton.classList.contains('botonPositivo')
            alternarDisponibilidadProducto(idProducto,estaDisponible,boton)
        }
    })

    // Le da la funcion a los botones de modificar un producto
    const productosDOM: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.productos__div')
    productosDOM.forEach((productoDOM)=>{
        productoDOM.onclick =(event)=>{
            event.stopPropagation()
            const idProducto = productoDOM.id! // Obtiene el id del producto que se desea modificar
            const productoInformacion = productos.find(producto => producto._id.toString() === idProducto)! // Busca el id en el array de productos previamente buscado
            ventanaEmergenteModificarProducto(productoInformacion) // Envia la informacion del producto a la ventana emergente para modificar el producto
        }
    })

    const botonesEliminar: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.producto__eliminar')
    botonesEliminar.forEach((boton)=>{
        boton.onclick =async(event)=>{
            event.stopPropagation()
            const idProducto = boton.parentElement!.parentElement!.id!
            const respuesta:boolean = await preguntar('¿Estas seguro que quieres eliminar este producto?')
            if(respuesta) {
                const productoEliminado = await solicitudEliminarProducto(idProducto)
                if(productoEliminado) buscarCargarProductos() // Si el servidor no devuelve errores vuelve a cargar los productos            
            }
        }
    })
}

//Carga la seccion de pago
function cargarSeccionPago(){

    // let contenedorResumen: Element = document.getElementById("seccionCobro__resumen")!;
    // contenedorResumen.innerHTML=`
    // <div id="seccionCobro__resumen__indice-nombre" class="seccionCobro__resumen__indices">Nombre</div>
    // <div id="seccionCobro__resumen__indice-cantidad" class="seccionCobro__resumen__indices">Cantidad</div>
    // <div id="seccionCobro__resumen__indice-precio" class="seccionCobro__resumen__indices">Precio</div>
    // `; //Borra todo el contenido previo del contenedor, dejando solo los indices

    // let productosCarro: (string[] | number[])[]=carrito1.verCarrito();
    // let nombresCarro:string[]=productosCarro[0] as string[];
    // let cantidadesCarro:number[]=productosCarro[1] as number[];
    // let preciosCarro:number[]=productosCarro[2] as number[];
    

    // let fragmento:DocumentFragment = document.createDocumentFragment();
    
    // for (let i = 0; i < nombresCarro.length; i++) {
    //     let nombreProducto:HTMLElement = document.createElement(`div`);

    //     if (nombresCarro[i]=="vacio") {continue;} //Si el elemento esta vacio entonces pasa al siguiente

    //     nombreProducto.textContent=nombresCarro[i];
    //     nombreProducto.classList.add("seccionCobro__resumen__producto-nombre");
    //     fragmento.appendChild(nombreProducto);


    //     let cantidadProducto:HTMLElement = document.createElement('div');
    //     cantidadProducto.textContent=`${cantidadesCarro[i]}`;
    //     cantidadProducto.classList.add("seccionCobro__resumen__producto-cantidad")
    //     fragmento.appendChild(cantidadProducto)

    //     let precioProducto:HTMLElement = document.createElement(`div`);
    //     precioProducto.textContent=`$ ${preciosCarro[i]}`;
    //     precioProducto.classList.add("seccionCobro__resumen__producto-precio")
    //     fragmento.appendChild(precioProducto);
    // }
    // contenedorResumen.appendChild(fragmento);


}

//Le da funcion a los botones de la seccion de pago
function botonesSeccionPago():void{

//     //Les da la funcion a todos los botones de la seccion de pago

//     //Botones de agregar promociones
//     let botonesPromocion:NodeListOf<Element> = document.querySelectorAll(".seccionCobro__promociones__contenedores__boton")!
//     botonesPromocion.forEach(botonPromocion =>{
//         botonPromocion.addEventListener("click", event => {
//             let botonPromocion:Element = (event.target as HTMLElement)!
//             let contenedorPrecio:Element = botonPromocion.previousElementSibling!
//             let contenedorNombre:Element = contenedorPrecio.previousElementSibling!

//             let precio:number = Number(contenedorPrecio.textContent!.replace("$","").replace(".",""));
//             let nombre:string = contenedorNombre.textContent!

//             carrito1.sumarCarrito(nombre,1,precio)
//             cargarSeccionPago();
//             calcularPrecioFinal()
//         })
//     })


//     //Botones de medios de pago
//     let botonesMediosPago:NodeListOf<Element> = document.querySelectorAll(".seccionCobro__metodoPago__metodo")! //Se selecciona todos los botones de medios de pago
//     botonesMediosPago.forEach(botonMedioPago =>{ //Se recorre cada boton
//         botonMedioPago.addEventListener("click", event =>{ //Se escucha cuando se hace click en cada uno de ellos
//             let botonMedioPago:Element = event.target as HTMLElement
//             let cantidadBotonesActivos = document.querySelectorAll(".seccionCobro__metodoPago__metodo-active").length
//             if(!botonMedioPago.classList.contains("seccionCobro__metodoPago__metodo-active")&&cantidadBotonesActivos>1){ //Si ya hay dos medios de pago seleccionados y ademas se quiere agregar uno mas se lanza un mensaje de error
//                 ventanaEmergente("No se puede seleccionar mas de dos medios de pago")
//             }else{ //Selecciona un medio de pago
//                 botonMedioPago.classList.toggle("seccionCobro__metodoPago__metodo-active");
//             }
//             calcularPrecioFinal()
//         })
//     })


//     //Botones de modificaciones
//     let botonesModificacion:NodeListOf<Element>= document.querySelectorAll(".seccionCobro__modificacion__metodo")! //Selecciona todos los botones de modificaciones
//     botonesModificacion.forEach(botonModificacion =>{ //Se recorre cada boton
//         botonModificacion.addEventListener("click", event =>{ //Se escucha cuando se hace click en cada uno de ellos
//             let botonModificacion:Element = event.target as HTMLElement //Boton presionado
//             if(botonModificacion.classList.contains("seccionCobro__modificacion__metodo-active")){botonModificacion.classList.remove("seccionCobro__modificacion__metodo-active")} //Si esta activo y se presiona en el entonces lo desactiva
//             else{ //Si no esta activo y se presiona en el entonces...
//                 document.querySelector(".seccionCobro__modificacion__metodo-active")?.classList.remove("seccionCobro__modificacion__metodo-active") //Desactiva el que esta activo
//                 botonModificacion.classList.add("seccionCobro__modificacion__metodo-active") //Activa el boton presionado
//             }
//         })
//     })
}

function calcularPrecioFinal():void{
    let mediosPago:NodeListOf<Element>=document.querySelectorAll(".seccionCobro__metodoPago__metodo-active")
    let medioPago1 = mediosPago[0]
    let medioPago2 = mediosPago[1]
    console.log("Se evalua");
    if(medioPago1?true:false){
        console.log("Hay un medio seleccionado");
        let medioPago2: Element | null=medioPago1!.nextElementSibling;
        if(medioPago2?true:false){
            console.log("Hay dos medios de pago seleccionado");
        }
    }
}

const cargarBotonesBarraLateral=()=>{
    //Carga y le da funciones a la barra lateral
    document.getElementById("barraLateral_A__icono")!.addEventListener("click",()=>{
        document.getElementById("contenedorConfiguracionProductos__contenido")!.scrollIntoView(({block: 'center' }));
        seleccionProductoCargada=false; //Si el usuario se dirige al area de modificacion de productos entonces es posible que los productos cambien, por lo que se debe cargar nuevamente el area de seleccion de productos
        posicionUsuario=0;
    });
    document.getElementById("barraLateral_B__icono")!.addEventListener("click",()=>{
        document.getElementById("seleccionProductos")!.scrollIntoView(({block: 'center' }));
        posicionUsuario=1;
        cargarVentaPublico()
    });
    document.getElementById("barraLateral_C__icono")!.addEventListener("click",()=>{
        document.getElementById("seccionCobro")!.scrollIntoView(({block: 'center' }));
        posicionUsuario=2;
    });
}

const cargarBotonesVentaPublico=()=>{
    // Escucha si el usuario busca un SKU especifico
    const inputBuscarSKU = document.getElementById('seleccionProductos__input-buscarSKU')! as HTMLInputElement
    inputBuscarSKU.value = sessionStorage.getItem('SKUBuscado')||''
    inputBuscarSKU.addEventListener('input',()=>{
        sessionStorage.setItem('SKUBuscado',inputBuscarSKU.value)
        cargarVentaPublico()
    })

    // Escucha si el usuario busca una palabra especifica
    const inputBuscarProducto = document.getElementById('seleccionProductos__input-buscar')! as HTMLInputElement
    inputBuscarProducto.value=sessionStorage.getItem('palabraBuscada')||''
    inputBuscarProducto.addEventListener('input',()=>{
        sessionStorage.setItem('palabraBuscada', inputBuscarProducto.value ); // Si no existe, lo crea; si existe, lo actualiza
        cargarVentaPublico()
    })
    
    // Escucha si el usuario elige entre agrupar o no los productos en categorias
    const botonAgruparCategorias = document.getElementById('seleccionProductos__botonAgruparCategorias')! as HTMLInputElement
    botonAgruparCategorias.checked = sessionStorage.getItem('agruparPorCategorias')?true:false

    botonAgruparCategorias.addEventListener('click',()=>{
        const esActivo = sessionStorage.getItem('agruparPorCategorias'); // Verifica el estado actual

        if(esActivo) sessionStorage.setItem('agruparPorCategorias','') // Si estaba activo, lo desactiva
        else sessionStorage.setItem('agruparPorCategorias','true') // Si no estaba activo, lo activa

        cargarVentaPublico()
    })
    
    // Escucha si el usuario elige ver solo las variantes o agrupadas por producto
    const botonSoloVariantes = document.getElementById('seleccionProductos__botonSoloVariantes')! as HTMLInputElement
    botonAgruparCategorias.checked = sessionStorage.getItem('soloVariantes')?true:false

    botonSoloVariantes.addEventListener('click',()=>{
        const esActivo = sessionStorage.getItem('soloVariantes'); // Verifica el estado actual

        if(esActivo) sessionStorage.setItem('soloVariantes','') // Si estaba activo, lo desactiva
        else sessionStorage.setItem('soloVariantes','true') // Si no estaba activo, lo activa

        cargarVentaPublico()
    })
}

const cargarVentaPublico =async()=>{
    // Define los query params para enviarlos en el fetch y asi filtrar los productos
    const palabraBuscada = sessionStorage.getItem('palabraBuscada') || '';
    const esAgruparPorCategoria = sessionStorage.getItem('agruparPorCategorias')||'';
    const esSoloVariantes = sessionStorage.getItem('soloVariantes')||'';
    const SKUBuscado = sessionStorage.getItem('SKUBuscado')||''

    const respuesta = await obtenerProductos('','100000000000','','',palabraBuscada,'','','true',SKUBuscado)
    productosVenta = respuesta.productos
    const categoriasCompletas = respuesta.categoriasCompletas
    
    cargarProductosVentaDOM(productosVenta,categoriasCompletas,esAgruparPorCategoria,esSoloVariantes)

}

const cargarProductosVentaDOM =(productos:producto[],categoriasCompletas:CategoriaI[],esMostrarCategorias:string|null,esSoloVariantes:string|null)=>{
    const contenedor = document.getElementById('seleccionProductos__div-productos')!;
    let productosDIV: HTMLDivElement[][] = Array.from({ length: categoriasCompletas.length }, () => []); // Inicializa la variable con una longitud igual a la longitud del array de cateogirasId
    const nombreCategorias:string[] = categoriasCompletas.map(categoria=>categoria.nombre)
    const fragmento = document.createDocumentFragment()

    // Agrega los productos
    if(esSoloVariantes){

        productos.forEach(producto=>{
            // Verifica el indice de la categoria del producto en el array de categorias
            const indiceCategoria:number = nombreCategorias.indexOf((producto.categoria as CategoriaI).nombre);

            (producto.variantes as variante[]).forEach(variante => {
                
                // Crea el contenedor general de la variante
                const varianteDIV = document.createElement('div')
                varianteDIV.classList.add('ventaPublico__div-varianteCompleta')
                varianteDIV.classList.add('noActivo')
                varianteDIV.innerHTML=`<div>${variante.SKU}</div>` // SKU de la variante
                // varianteDIV.onclick=()=>varianteDIV.querySelectorAll('.ventaPublico__div-variantes')?.forEach(varianteDIV=>varianteDIV.classList.toggle('noActivo')) // Alterna la visibilidad de las variantes del producto seleccionado
                
                // Nombre del producto y boton para sumar cantidad
                const nombreProducto = document.createElement('button')
                nombreProducto.classList.add('botonRegistener3')
                nombreProducto.textContent=producto.nombre // Le asigna el nombre del producto
                nombreProducto.onclick=()=>{
                    const varianteCantidad = carrito1.cambiarCarrito(variante.SKU,1,producto.precio);
                    varianteDIV.querySelector('.div-productos__div-cantidad')!.textContent = varianteCantidad.toString();
                }
                varianteDIV.appendChild(nombreProducto)

                // Boton para restar la variante al carrito
                const botonRestar = document.createElement('button')
                botonRestar.classList.add('botonRegistener3')
                botonRestar.classList.add('fa-solid')
                botonRestar.classList.add('fa-minus')
                botonRestar.onclick=()=>{
                    const varianteCantidad = carrito1.cambiarCarrito(variante.SKU,-1,producto.precio);
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


    }else{


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
            <i class="fa-solid fa-palette"></i>
            <i class="fa-solid fa-ruler-horizontal"></i>
            <div>SKU</div>
            <div></div>
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
                    const varianteCantidad = carrito1.cambiarCarrito(variante.SKU,1,producto.precio);
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
                    const varianteCantidad = carrito1.cambiarCarrito(variante.SKU,-1,producto.precio);
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
    }

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


document.addEventListener("DOMContentLoaded", async function() {

    // Busca y carga los productos en el contenedor pasado como argumento
    const contenedorCategorias:HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__categorias')!
    const contenedorOpcionesCategorias = document.getElementById('modificarProducto__caracteristicas__select__categoria')! as HTMLSelectElement
    



    [,categorias] = await Promise.all([
        buscarCargarProductos(), // Busca y carga los productos
        buscarCargarCategorias(contenedorCategorias,contenedorOpcionesCategorias) // Busca y carga las categorias

    ]);

    cargarBotonesBarraLateral()
    cargarBotonesVentaPublico()
});





