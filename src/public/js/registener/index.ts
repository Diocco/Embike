
import { buscarCategorias } from "../helpers/categorias.js"
import { buscarProductos } from "./productos.js"

interface Producto {
    foto:string,
    nombre:string,
    precio:number,
    stock:number,
    id:string,
    color:string,
    codigoBarra:number,
    promocionable:string,
    descripcion:string,
    tipo:string,
    categoria:string,
    seleccionado:string,
    orden:number
}


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


























//Carga la seccion de seleccion de productos, se ejecuta cada vez que se hace click sobre la barra lateral para desplazarse a este mismo
function cargarSeleccionProductos() {
    let contenedorIndiceTipos:HTMLElement = document.getElementById("seleccionProductos")!;
    contenedorIndiceTipos.innerHTML=`` //Vacia la seccion por si habia elementos cargados previamente
    buscarTiposSeleccionados().then(tiposSeleccionados=>{ //Primero busca los tipos que tengan almenos un producto seleccionado
        const fragmento:DocumentFragment = document.createDocumentFragment();
        let numeroTipo:number = 1;

        tiposSeleccionados.forEach(tipo => { //Recorre los tipos seleccionados
            const titulo:HTMLDivElement = document.createElement("div");
            titulo.classList.add("seleccionProductos__indiceTitulo");
            titulo.textContent=tipo;

            const indiceTipo:HTMLDivElement = document.createElement("div"); //Y crea un div para cada tipo
            indiceTipo.appendChild(titulo);
            indiceTipo.classList.add("seleccionProductos__indice");
            indiceTipo.id=`seleccionProductos__indiceTipo${numeroTipo}`

            numeroTipo++;
            buscarProductosSeleccionados(tipo).then(productosSeleccionados =>{ //Se busca los productos seleccionados que tiene ese tipo
                productosSeleccionados.forEach(producto => {
                    let productoCreado:HTMLDivElement = document.createElement("div");
                    productoCreado.classList.add("seleccionProducto");
                    productoCreado.innerHTML=`
                    <button title="${producto.precio}" class="seleccionSumarProducto">${producto.nombre}</button>
                    <button class="seleccionRestarProducto">-</button>
                    <div class="seleccionCantidad">0</div>
                    <div class="seleccionStock">${producto.stock}</div>
                    `

                    indiceTipo.appendChild(productoCreado); //Agrega el producto encontrado al contenedor del mismo tipo
                });
            })
            fragmento.appendChild(indiceTipo); //Agrega el tipo, con todos los productos que cumplen dicho tipo, al fragmento
        });

        contenedorIndiceTipos.appendChild(fragmento); //Agrega todos los elementos cargados al DOM
        //A continuacion se les da las funciones a todos los botones
        setTimeout(() => { //Se coloca un retraso para darle tiempo a que los elementos se carguen en el DOM
            document.querySelectorAll(".seleccionProducto").forEach(conjuntoBotones => {
                let botonSumar = conjuntoBotones.children[0] as HTMLElement
                let botonRestar = conjuntoBotones.children[1] as HTMLElement
                let cantidad = conjuntoBotones.children[2] as HTMLElement
                let stock = conjuntoBotones.children[3] as HTMLElement

                botonSumar.addEventListener("click",()=>{
                    cantidad.textContent=`${Number(cantidad.textContent)+1}`;
                    stock.textContent=`${Number(stock.textContent)-1}`;
                    if(Number(cantidad.textContent)==0){
                        cantidad.classList.remove("seleccionCantidad-active");
                        cantidad.classList.remove("seleccionCantidad-active2");
                    }else if(Number(cantidad.textContent)<0){
                        cantidad.classList.remove("seleccionCantidad-active");
                        cantidad.classList.remove("seleccionCantidad-active2");
                        cantidad.classList.add("seleccionCantidad-active2");
                    }else{
                        cantidad.classList.add("seleccionCantidad-active");
                        cantidad.classList.remove("seleccionCantidad-active2");
                    }
                    carrito1.sumarCarrito(botonSumar.textContent!,1,Number(botonSumar.title))
                })
                botonRestar.addEventListener("click",()=>{
                    cantidad.textContent=`${Number(cantidad.textContent)-1}`;
                    stock.textContent=`${Number(stock.textContent)+1}`;
                    if(Number(cantidad.textContent)==0){
                        cantidad.classList.remove("seleccionCantidad-active");
                        cantidad.classList.remove("seleccionCantidad-active2");
                    }else if(Number(cantidad.textContent)<0){
                        cantidad.classList.remove("seleccionCantidad-active");
                        cantidad.classList.add("seleccionCantidad-active2");
                    }else{
                        cantidad.classList.add("seleccionCantidad-active");
                        cantidad.classList.remove("seleccionCantidad-active2");
                    }
                    carrito1.sumarCarrito(botonSumar.textContent!,-1,Number(botonSumar.title))
                })
            });
        }, 10);
    })
}

//Busca los tipos que tengan productos seleccionados
function buscarTiposSeleccionados():Promise<string[]> {
    //Se busca los diferentes "tipos" que hay en la base de datos que esten seleccionados
    return new Promise((resolve) => {
        let tiposSeleccionadosEncontrados:string[]=["Vacio"]; //Crea un array vacio para guardar todos los tipos encontrados

        let peticionCursor:IDBRequest<IDBCursorWithValue | null>= db.transaction([`productos`],`readonly`).objectStore(`productos`).index(`porSeleccion`).openCursor(IDBKeyRange.only("true")); //Abre el almacen filtrado por los productos seleccionado
        peticionCursor.onsuccess=(event)=>{ //El filtro se aplico con exito
            let cursorTiposSeleccionados:IDBCursorWithValue = (event.target as IDBRequest).result;
            if(cursorTiposSeleccionados){ //Recorre el cursor 
                let tipoEncontrado:boolean=false; 
                if(tiposSeleccionadosEncontrados[0]==="Vacio"){tiposSeleccionadosEncontrados[0]=cursorTiposSeleccionados.value.tipo;} //Si el array esta vacio entonces coloca como primer elemento el primer tipo del primer producto encontrado
                else{ //Si tiene tipos encontrados entonces los recorre para buscar nuevos y agregarlos
                    tiposSeleccionadosEncontrados.forEach(tipoSeleccionado => { 
                        if (tipoSeleccionado===cursorTiposSeleccionados.value.tipo) {//Verifica si el tipo actual se encuentra en el array de tipos encontrados
                            tipoEncontrado=true; //Si lo encuentra se deja constancia
                        }
                    });
                    if(!tipoEncontrado){tiposSeleccionadosEncontrados.push(cursorTiposSeleccionados.value.tipo);} //Si despues de recorrer el array de tipos encontrados no se encontro el tipo que se esta evaluando entonces lo agrega
                }
                cursorTiposSeleccionados.continue(); //Se sigue con el siguiente tipo
            }else{ //Una vez que se termina de buscar...
                resolve(tiposSeleccionadosEncontrados);
            }
        }
    })

}

//Funcion que se le pasa como parametro el "tipo" y busca los productos con ese "tipo" y que esten seleccionados para mostrarse
function buscarProductosSeleccionados(tipo:string):Promise<Producto[]> {
    //Se busca los diferentes productos que esten seleccionados para un tipo especifico
    return new Promise((resolve) => {
        let productosSeleccionadosEncontrados:Producto[]=[]; //Crea un array para guardar todos los productos encontrados

        let peticionCursor = db.transaction([`productos`],`readonly`).objectStore(`productos`).index(`porTipo`).openCursor(IDBKeyRange.only(tipo)); //Abre una peticion para abrir un cursor para recorrer el almacen filtrado por el tipo recibido como parametro

        peticionCursor.onsuccess=(event)=>{ //Si el cursor se abrio con exito...
            let cursorProductosFiltrados:IDBCursorWithValue = (event.target as IDBRequest).result;
            if(cursorProductosFiltrados){ //Recorre el cursor  
                if(cursorProductosFiltrados.value.seleccionado==="true"){//Almacena el producto filtrado que este seleccionado
                    if(productosSeleccionadosEncontrados===undefined){productosSeleccionadosEncontrados=cursorProductosFiltrados.value;} //Si el array esta vacio coloca el primer producto como el primer elemento 
                    else{productosSeleccionadosEncontrados.push(cursorProductosFiltrados.value);}
                }
                cursorProductosFiltrados.continue(); //Se sigue con el siguiente tipo
            }else{ //Una vez que se termina de buscar...
                resolve(productosSeleccionadosEncontrados);
            }
        }
    })
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
    const contenedorProductos: HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__productos')!
    const contenedorCategorias:HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__categorias')!
    const contenedorOpcionesCategorias = document.getElementById('modificarProducto__caracteristicas__select__categoria')! as HTMLSelectElement

    Promise.all([
        buscarProductos(contenedorProductos), // Busca y carga los productos
        buscarCategorias(contenedorCategorias,contenedorOpcionesCategorias) // Busca y carga las categorias
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
    
    //Carga el area de seleccion de productos
    document.getElementById("barraLateral_B__icono")!.onclick=()=>{
        if(!seleccionProductoCargada){cargarSeleccionProductos();seleccionProductoCargada=true;}
    }
    document.getElementById("barraLateral_B__nombre")!.onclick=()=>{
        if(!seleccionProductoCargada){cargarSeleccionProductos();seleccionProductoCargada=true;}
    }

    //Carga el area de pago
    document.getElementById("barraLateral_C__icono")!.onclick=()=>{
        cargarSeccionPago();
    }
    document.getElementById("barraLateral_C__nombre")!.onclick=()=>{
        cargarSeccionPago();
    }


});





