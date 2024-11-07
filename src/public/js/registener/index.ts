
import { CategoriaI } from "../../../models/interfaces/categorias.js"
import { producto } from "../../../models/interfaces/producto.js"
import { buscarCargarCategorias } from "../helpers/categorias.js"
import { obtenerProductos, solicitudEliminarProducto } from "../services/productosAPI.js"
import { agregarProductosDOM, alternarDisponibilidadProducto } from "./productos.js"
import { ventanaEmergenteModificarProducto } from "./ventanasEmergentes/modificarProducto.js"
import { preguntar } from "./ventanasEmergentes/preguntar.js"



class carrito{
    constructor(public nombre:string[],public cantidad:number[],public precio:number[]){}
    sumarCarrito(agregarNombre:string,agregarCantidad:number,agregarPrecio:number){
        let ubicacion:number = this.buscarCarrito(agregarNombre)
        if(ubicacion===-1){//Si el producto no se encuentra en el carrito entonces lo agrega
            this.nombre.push(agregarNombre)
            this.cantidad.push(agregarCantidad)
            this.precio.push(agregarPrecio)
        }else{ //Si el producto se encuentra en la base de datos entonces simplemente agrega la cantidad ingresada
            this.cantidad[ubicacion]=this.cantidad[ubicacion]+agregarCantidad;
            if(this.cantidad[ubicacion]===0){this.eliminarProducto(ubicacion);}//Si la cantidad queda en cero entonces elimina el producto del carro
            else{
                this.nombre[ubicacion]=agregarNombre;
                this.precio[ubicacion]=agregarPrecio;
            } //Se sobrescribe el nombre por si acaso se esta remplazando la posicion "vacio"
        }
    }
    eliminarProducto(ubicacion:number):void{
        this.nombre.splice(ubicacion, 1);
        this.cantidad.splice(ubicacion, 1);
        this.precio.splice(ubicacion, 1);
    }
    verCarrito(){

        return [this.nombre,this.cantidad,this.precio]
    }
    private buscarCarrito(buscarNombre:string):number{ //Busca el producto en el carro y devuelve su ubicacion
        let contador:number = 0;
        let ubicacion:number = -1;
        this.nombre.forEach(nombre=>{
            if(nombre===buscarNombre||nombre==="vacio"){ //Si lo encuentra guarda su ubicacion
                ubicacion=contador;
            }
            contador++
        })
        return ubicacion //Termina de buscar, si lo encuentro devuelve su ubicacion y si no lo encuentra devuelve -1
    }
    reiniciarCarrito(){ //Reinicia el carrito
        this.nombre.splice(1);
        this.cantidad.splice(1);
        this.precio.splice(1);
        this.nombre[0]="vacio";
        this.cantidad[0]=0;
        this.precio[0]=0;
    }
}

let carrito1 = new carrito(["vacio"],[0],[0])

//Variables globales
let tipoSeleccionado:string //Indica que "tipo" se selecciono en la configuracion de productos
let categoriaSeleccionada:string //Indica que "categoria" se selecciono en la configuracion de productos
let db:IDBDatabase // Data Base
let peticionDB:IDBOpenDBRequest = indexedDB.open("DB",1); 
let seleccionProductoCargada:boolean=false //Indica si el area de seleccion de productos esta cargada, util para volverla a cargar en caso de que se haya ingresado al area de modificacion de productos o si simplemente no esta cargada
let posicionUsuario:number = 0 //Indica en que ventana esta el usuario, se usa para lanzar ventanas de error




// Define las funciones
// Carga las categorias validas en el DOM
// Busca las categorias validas en la base de datos



















const contenedorProductos: HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__productos')!
export let productos:producto[]
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

    productos = await obtenerProductos(desde,hasta,precioMin,precioMax,palabraBuscada,categorias,ordenar),
    await agregarProductosDOM(productos,contenedorProductos) // Si se encuentran productos para los parametros de busqueda entonces los agrega
    botonesConfiguracionProducto() // Le da la funcion a los botones de cada producto
}

const botonesConfiguracionProducto =()=>{
    // Le da la funcion a los botones de alternar disponibilidad de un producto
    const botonesDisponibilidad: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.producto__disponibilidad')
    botonesDisponibilidad.forEach((boton)=>{
        boton.onclick =()=>{
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
        boton.onclick =async()=>{
            const idProducto = boton.parentElement!.parentElement!.id!
            const respuesta:boolean = await preguntar('¿Estas seguro que quieres eliminar este producto?')
            if(respuesta) {
                const productoEliminado = await solicitudEliminarProducto(idProducto)
                if(productoEliminado) buscarCargarProductos() // Si el servidor no devuelve errores vuelve a cargar los productos            
            }
        }
    })
}





//Carga la seccion de seleccion de productos, se ejecuta cada vez que se hace click sobre la barra lateral para desplazarse a este mismo
function cargarSeccionProductos() {
    const botonAgregarProductos = document.getElementById('contenedorConfiguracionProductos__contenido__agregarProducto')! as HTMLButtonElement
    botonAgregarProductos.onclick=()=>{
        ventanaEmergenteModificarProducto() // Abre la ventana emergente para modificar un producto, al no pasarle ningun ID la funcion crea un producto nuevo.
    }
}













//Carga la seccion de pago
function cargarSeccionPago(){

    let contenedorResumen: Element = document.getElementById("seccionCobro__resumen")!;
    contenedorResumen.innerHTML=`
    <div id="seccionCobro__resumen__indice-nombre" class="seccionCobro__resumen__indices">Nombre</div>
    <div id="seccionCobro__resumen__indice-cantidad" class="seccionCobro__resumen__indices">Cantidad</div>
    <div id="seccionCobro__resumen__indice-precio" class="seccionCobro__resumen__indices">Precio</div>
    `; //Borra todo el contenido previo del contenedor, dejando solo los indices

    let productosCarro: (string[] | number[])[]=carrito1.verCarrito();
    let nombresCarro:string[]=productosCarro[0] as string[];
    let cantidadesCarro:number[]=productosCarro[1] as number[];
    let preciosCarro:number[]=productosCarro[2] as number[];
    

    let fragmento:DocumentFragment = document.createDocumentFragment();
    
    for (let i = 0; i < nombresCarro.length; i++) {
        let nombreProducto:HTMLElement = document.createElement(`div`);

        if (nombresCarro[i]=="vacio") {continue;} //Si el elemento esta vacio entonces pasa al siguiente

        nombreProducto.textContent=nombresCarro[i];
        nombreProducto.classList.add("seccionCobro__resumen__producto-nombre");
        fragmento.appendChild(nombreProducto);


        let cantidadProducto:HTMLElement = document.createElement('div');
        cantidadProducto.textContent=`${cantidadesCarro[i]}`;
        cantidadProducto.classList.add("seccionCobro__resumen__producto-cantidad")
        fragmento.appendChild(cantidadProducto)

        let precioProducto:HTMLElement = document.createElement(`div`);
        precioProducto.textContent=`$ ${preciosCarro[i]}`;
        precioProducto.classList.add("seccionCobro__resumen__producto-precio")
        fragmento.appendChild(precioProducto);
    }
    contenedorResumen.appendChild(fragmento);


}

//Le da funcion a los botones de la seccion de pago
// function botonesSeccionPago():void{

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
// }

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



document.addEventListener("DOMContentLoaded", async function() {

    // Busca y carga los productos en el contenedor pasado como argumento
    const contenedorCategorias:HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__categorias')!
    const contenedorOpcionesCategorias = document.getElementById('modificarProducto__caracteristicas__select__categoria')! as HTMLSelectElement
    


    [,,categorias] = await Promise.all([
        cargarSeccionProductos(), // Le da la funcionalidad a los botones de la seccion de modificar productos
        buscarCargarProductos(),
        buscarCargarCategorias(contenedorCategorias,contenedorOpcionesCategorias) // Busca y carga las categorias
    ]);




    
    








    //Carga y le da funciones a la barra lateral
    document.getElementById("barraLateral_A__icono")!.addEventListener("click",()=>{
        document.getElementById("contenedorConfiguracionProductos")!.scrollIntoView();
        seleccionProductoCargada=false; //Si el usuario se dirige al area de modificacion de productos entonces es posible que los productos cambien, por lo que se debe cargar nuevamente el area de seleccion de productos
        carrito1.reiniciarCarrito();
        posicionUsuario=0;
    });
    document.getElementById("barraLateral_A__nombre")!.addEventListener("click",()=>{
        document.getElementById("contenedorConfiguracionProductos")!.scrollIntoView();
        seleccionProductoCargada=false; //Si el usuario se dirige al area de modificacion de productos entonces es posible que los productos cambien, por lo que se debe cargar nuevamente el area de seleccion de productos
        carrito1.reiniciarCarrito();
        posicionUsuario=0;
    });
    document.getElementById("barraLateral_B__icono")!.addEventListener("click",()=>{
        document.getElementById("seleccionProductos")!.scrollIntoView();
        posicionUsuario=1;
    });
    document.getElementById("barraLateral_B__nombre")!.addEventListener("click",()=>{
        document.getElementById("seleccionProductos")!.scrollIntoView();
        posicionUsuario=1;
    });
    document.getElementById("barraLateral_C__icono")!.addEventListener("click",()=>{
        document.getElementById("seccionCobro")!.scrollIntoView();
        posicionUsuario=2;
    });
    document.getElementById("barraLateral_C__nombre")!.addEventListener("click",()=>{
        document.getElementById("seccionCobro")!.scrollIntoView();
        posicionUsuario=2;
    });
    


    //Carga el area de pago
    document.getElementById("barraLateral_C__icono")!.onclick=()=>{
        cargarSeccionPago();
    }
    document.getElementById("barraLateral_C__nombre")!.onclick=()=>{
        cargarSeccionPago();
    }


});





