

//Boton de agregar elementos al catalogo//

// async function funcionBotonesAgregarCatalogo(){
//     var botonAgregarAlCatalogo = document.getElementById("catalogo__div-modificar__button-agregar");
//     var catalogo = document.getElementById("catalogo");
//     let elementoNumero = 6;

//     botonAgregarAlCatalogo.addEventListener("click", function() {
//         // Crear un nuevo elemento
//         let nombre=prompt("Ingrese el nombre del producto");
//         let precio=prompt("Ingrese el precio del producto");
//         elementoNumero++;

//         var nuevoProducto = document.createElement("div");
//         nuevoProducto.setAttribute("class","catalogo__div");
//         nuevoProducto.setAttribute("id",`catalogo__elemento${elementoNumero}`);
//         nuevoProducto.innerHTML = `
//             <img class="catalogo__div__imagen" src="img/catalogoImagenes/bici.png">
//             <h2 class="catalogo__div__nombre">${nombre}</h2>
//             <h3 class="catalogo__div__precio">$${precio}</h3>
//             <button class="catalogo__div__comprar">Agregar al carro</button>
//         `;
//         // Agregar el nuevo elemento al contenedor
//         catalogo.appendChild(nuevoProducto);
//     });
// };
////////////////////////////////



//Alternar el active en los botones del indice
document.addEventListener("DOMContentLoaded", function() {
    const filtroCategoriaBoton1:HTMLElement = document.getElementById("filtroCategoriaBoton1")!;
    const filtroCategoriaBoton2:HTMLElement = document.getElementById("filtroCategoriaBoton2")!;
    const filtroCategoriaBoton3:HTMLElement = document.getElementById("filtroCategoriaBoton3")!;
    const filtroCategoriaBoton4:HTMLElement = document.getElementById("filtroCategoriaBoton4")!;

    filtroCategoriaBoton1.addEventListener("click", function() {
        filtroCategoriaBoton1.classList.toggle(`botonActive`);
    });
    filtroCategoriaBoton2.addEventListener("click", function() {
        filtroCategoriaBoton2.classList.toggle(`botonActive`);
    });
    filtroCategoriaBoton3.addEventListener("click", function() {
        filtroCategoriaBoton3.classList.toggle(`botonActive`);
    });
    filtroCategoriaBoton4.addEventListener("click", function() {
        filtroCategoriaBoton4.classList.toggle(`botonActive`);
    });

    const filtroRodadoBoton1:HTMLElement = document.getElementById("filtroRodadoBoton1")!;
    const filtroRodadoBoton2:HTMLElement = document.getElementById("filtroRodadoBoton2")!;
    const filtroRodadoBoton3:HTMLElement = document.getElementById("filtroRodadoBoton3")!;
    const filtroRodadoBoton4:HTMLElement = document.getElementById("filtroRodadoBoton4")!;
    const filtroRodadoBoton5:HTMLElement = document.getElementById("filtroRodadoBoton5")!;

    filtroRodadoBoton1.addEventListener("click", function() {
        filtroRodadoBoton1.classList.toggle(`botonActive`);
    });
    filtroRodadoBoton2.addEventListener("click", function() {
        filtroRodadoBoton2.classList.toggle(`botonActive`);
    });
    filtroRodadoBoton3.addEventListener("click", function() {
        filtroRodadoBoton3.classList.toggle(`botonActive`);
    });
    filtroRodadoBoton4.addEventListener("click", function() {
        filtroRodadoBoton4.classList.toggle(`botonActive`);
    });
    filtroRodadoBoton5.addEventListener("click", function() {
        filtroRodadoBoton5.classList.toggle(`botonActive`);
    });
});


// //Agrega los elementos al catalogo, verfica su stock, precio, nombre desde la base de datos del servidor
// document.addEventListener("DOMContentLoaded", function() {
//     let productosDB //Almacena los productos devueltos por el fetch
//     let cargaInicial = 9 //Cantidad de elementos que intenta cargar el catalogo apenas se carga la pagina
//     let elementosCargados = 0 //Lleva el recuento del total de elementos cargados 
//     let agregarElementosCargados = 3 //Marca el ritmo de publicaciones que se van agregando a medida que el usuario las va viendo
//     let ultimaPublicacion //Se define la variable que contiene el ultimo elemento de la publicacion, este elemento cambia a medida que se cargan los objetos, util para el LazyLoad

// function buscarProductos(){

//     setTimeout(() => {//Genera un pequeño retraso simulando la comunicacion que hay con el servidor

//     fetch("baseProductos.txt")
//     .then(res =>{
//         if(!res.ok){
//             throw new Error("No se pudo acceder a la base de datos correctamente");
//         }else{
//             return res.json();
//         }})
//     .then(productos =>{
//         productosDB = productos;
//         cargarProductos(productosDB,cargaInicial); //Carga los primeros elementos
//     })
//     .catch(error =>{
//         console.log(error);
//     })
    
//     }, Math.random()*1000)}; 

// function cargarProductos(producto,cargaHasta){
//     const contenedorProductos= document.getElementById('catalogo'); //Toma el catalogo como el contenedor de los productos a agregar
//     const fragmento = document.createDocumentFragment(); //Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo
//     let agregarElemento;
            
//     for (let i = elementosCargados; i < cargaHasta; i++) { // Agrega todos los elementos al fragmento
//         agregarElemento  = document.createElement('div');
//         if(producto[i].cantidad>0){
//             agregarElemento.innerHTML=`
//             <div class="catalogo__div" id="${producto[i].id}" data-imagen1="${producto[i].imagen}" data-nombre="${producto[i].nombre}" data-precio="$ ${producto[i].precio}">
//             <div class="catalogo__div__imagen" style='background-image: url("${producto[i].imagen}');"></div>
//             <h2 class="catalogo__div__nombre">${producto[i].nombre}</h2>
//             <h3 class="catalogo__div__precio">$ ${producto[i].precio}</h3>
//             <button class="catalogo__div__comprar">Agregar al carro</button>
//             </div>
//             `;
//         }else{
//             agregarElemento.innerHTML=`
//             <div class="catalogo__div" id="${producto[i].id}" data-imagen1="${producto[i].imagen}" data-nombre="${producto[i].nombre}" data-precio="$ ${producto[i].precio}">
//             <div class="catalogo__div__imagen" style='background-image: url("${producto[i].imagen}');"></div>
//             <h2 class="catalogo__div__nombre">${producto[i].nombre}</h2>
//             <h3 class="catalogo__div__precio">$ ${producto[i].precio}</h3>
//             <button class="catalogo__div__comprar catalogo__div__comprar-noDisponible">No disponible</button>
//             </div>
//             `;
//         }
//         elementosCargados++;
//         fragmento.appendChild(agregarElemento); //Agrega el producto recien creado al fragmento
//     };

//     contenedorProductos.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo

//     ultimaPublicacion = document.getElementById("catalogo").lastElementChild //Define cual es el ultimo elemento del catalogo
//     lazyLoad();

//     //Se agrega el comportamiento de cuando se hace click sobre cualquier producto
    
//     //Se configura el comportamiento de la ventana
//     const productosCargados:NodeListOf<HTMLElement> = document.querySelectorAll('.catalogo__div');
//     const visualizarProducto:HTMLElement = document.getElementById("catalogoProducto")!;
//     const catalogo__fondo:HTMLElement = document.getElementById("catalogo__fondo")!;
//     const catalogoProducto__imagen:HTMLElement = document.getElementById("catalogoProducto__imagen")!;

//     if(visualizarProducto){}else{throw "Error, no se encontro el producto"}
//     if(catalogo__fondo){}else{throw "Error, no se encontro el producto"}
//     if(catalogoProducto__imagen){}else{throw "Error, no se encontro el producto"}

//     //Recorre los productos cargados en el catalogo para darle funcionalidad
//     productosCargados.forEach(producto => {
//         if(producto){}else{throw "Error, no se encontro el producto"}
        
//         producto.addEventListener("click",()=>{
//             let titulo:HTMLElement = document.getElementById("catalogoProducto__titulo")!;
//             const precio:HTMLElement = document.getElementById("catalogoProducto__precio")!;
            
//             titulo.textContent!=producto.dataset.nombre  //Titulo del producto seleccionado
//             if(titulo.textContent){}else{throw "Error, no se encontro el titulo del producto"}
            
//             precio.textContent!=producto.dataset.precio  //Precio del producto seleccionado
//             if(precio.textContent){}else{throw "Error, no se encontro el precio del producto"}

//             catalogoProducto__imagen.style.backgroundImage=`url("${producto.dataset.imagen1}")`; //Imagen del producto seleccionado
//             visualizarProducto.classList.toggle("catalogoProducto-active");
//             catalogo__fondo.classList.toggle("catalogo__fondo-active");
//         });
//     });

//     function salirCatalogo() { //Funcion para volver al catalogo
//         catalogo__fondo.classList.toggle("catalogo__fondo-active");
//         visualizarProducto.classList.toggle("catalogoProducto-active");
//     }

//     let catalogoProducto__salir = document.getElementById("catalogoProducto__salir");
//     catalogoProducto__salir.addEventListener("click",()=>{salirCatalogo();})    //Comportamiento de el boton de salir
//     catalogo__fondo.addEventListener("click",()=>{salirCatalogo();})    //Comportamiento del fondo

// }

// //LazyLoad (Carga los elementos segun el usuario los este por ver)
// function lazyLoad() {
//     const callback = (entries)=>{

//         if(entries[0].isIntersecting){
//             if(productosDB.length>=elementosCargados+agregarElementosCargados){
//                 cargarProductos(productosDB,elementosCargados+agregarElementosCargados);
//             }else if(productosDB.length>elementosCargados){
//                 cargarProductos(productosDB,productosDB.length);
//             }else if(productosDB.length==elementosCargados){
//                 console.log("Se ha completado la carga de los productos");
//             }else{
//                 console.log("Se ha producido un error");
//             }
//         }
//     }

//     const observador = new IntersectionObserver(callback);

//     observador.observe(ultimaPublicacion);
// }

// buscarProductos();
// })
//

