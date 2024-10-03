
//Se agrega el comportamiento de cuando se hace click sobre cualquier producto
const ventanaEmergenteProductos = () =>{
    //Se configura el comportamiento de la ventana
    const productosCargados:NodeListOf<HTMLElement> = document.querySelectorAll('.catalogo__div'); // Crea un array con los nodos de los productos existentes en el DOM

    const ventanaEmergenteProducto:HTMLElement = document.getElementById("catalogoProducto")!; // Ventana emergente donde aparece toda la informacion del producto seleccionado
    const catalogo__fondo:HTMLElement = document.getElementById("catalogo__fondo")!; // Fondo de la ventana emergente
    const catalogoProducto__imagen:HTMLElement = document.getElementById("catalogoProducto__imagen")!; // Imagen del producto seleccionado dentro de la ventana emergente
    const titulo:HTMLElement = document.getElementById("catalogoProducto__titulo")!; // Nombre del producto seleccionado dentro de la ventana emergente
    const precio:HTMLElement = document.getElementById("catalogoProducto__precio")!; // Precio del producto seleccionado dentro de la ventana emergente
    const catalogoProducto__salir:HTMLElement = document.getElementById("catalogoProducto__salir")!; // Boton de salir dentro de la ventana emergente

    //Recorre los productos cargados en el catalogo para darle funcionalidad
    productosCargados.forEach(producto => {
        
        producto.addEventListener("click",()=>{
            titulo.textContent=producto.dataset.nombre!  // Define el nombre del producto seleccionado dentro de la ventana emergente
            precio.textContent=producto.dataset.precio!  // Define el precio del producto seleccionado dentro de la ventana emergente
            catalogoProducto__imagen.style.backgroundImage=`url("${producto.dataset.imagen1}")`; // Define la imagen del producto seleccionado dentro de la ventana emergente
            
            ventanaEmergenteProducto.classList.toggle("catalogoProducto-active"); // Muestra la ventana emergente
            catalogo__fondo.classList.toggle("catalogo__fondo-active"); // Oscurece el fondo de la ventana emergente
        });
    });

    // Funciones para cerrar la ventana emergente
    //Comportamiento de el boton de salir
    catalogoProducto__salir.addEventListener("click",()=>{ 
        catalogo__fondo.classList.toggle("catalogo__fondo-active"); // Esconde la ventana emergente
        ventanaEmergenteProducto.classList.toggle("catalogoProducto-active"); // Vuelve el color del fondo de la ventana emergente a la normalidad
    })    

    //Comportamiento del fondo
    catalogo__fondo.addEventListener("click",()=>{ 
        catalogo__fondo.classList.toggle("catalogo__fondo-active"); // Esconde la ventana emergente
        ventanaEmergenteProducto.classList.toggle("catalogoProducto-active"); // Vuelve el color del fondo de la ventana emergente a la normalidad
    })    
}

// Agrega los productos recibidos como parametros al DOM
const agregarProductosDOM = (productos: any[]) => {
    const contenedorProductos: HTMLElement = document.getElementById('catalogo')!; //Toma el catalogo como el contenedor de los productos a agregar
    const fragmento: DocumentFragment = document.createDocumentFragment(); //Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo

    productos.forEach((producto: any ) => { // Recorre los productos

        let agregarElemento = document.createElement('div'); // Crea un div para alojar el nuevo producto
        agregarElemento.innerHTML=`
        <div class="catalogo__div" id="${producto._id}" data-imagen1="${producto.imagenes[0]}" data-nombre="${producto.nombre}" data-precio="$ ${producto.precio}">
        <div class="catalogo__div__imagen" style='background-image: url("${producto.imagenes[0]}');"></div>
        <h2 class="catalogo__div__nombre">${producto.nombre}</h2>
        <h3 class="catalogo__div__precio">$ ${producto.precio}</h3>
        <button class="catalogo__div__comprar">Agregar al carro</button>
        </div>
        `;
        fragmento.appendChild(agregarElemento); //Agrega el producto recien creado al fragmento

    })
    contenedorProductos.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo
    ventanaEmergenteProductos();
}



//Alternar el active en los botones del indice
document.addEventListener("DOMContentLoaded", function() {

    // Define el url dependiendo si se esta en produccion o en desarrollo
    let urlProductos:string = '/api/productos'
    let url:string

    if(esDesarollo){ // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
        url = 'http://localhost:8080';
        urlProductos = url + urlProductos;
    }else{ // Si no tiene localhost define el url en la pagina web para la peticion
        url= 'https://embike-223a165b4ff6.herokuapp.com';
        urlProductos=url + urlProductos;
    }


    // Alterna el "active" de los botones del indice cuando son presionados
    const botonesIndice: NodeListOf<Element> = document.querySelectorAll('.filtroBoton') 
    botonesIndice.forEach(botonIndice =>{
        botonIndice.addEventListener('click',()=>{
            botonIndice.classList.toggle(`botonActive`);
        })
    })

    //Agrega los productos al catalogo desde la base de datos

    let desde: number = 0; // Define el producto inicial que carga
    let hasta: number = 20; // Hasta que producto quiere cargar

    fetch(urlProductos+`?desde=${desde}&hasta=${hasta}`, { // Realiza la peticion GET para obtener los productos
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            agregarProductosDOM(data.productos)
        }
    })
    .catch(error => { // Si hay un error se manejan 
        console.error(error);
    })

})

