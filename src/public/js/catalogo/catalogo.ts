// Define el url dependiendo si se esta en produccion o en desarrollo
let urlProductos:string = '/api/productos'
let urlCategorias:string = '/api/categorias'

const urlObjeto = new URL(window.location.href);

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
    contenedorProductos.innerHTML='' // Vacia el contenedor para agregar nuevos productos
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
}

const buscarProductos = ()=>{
        // Aquí iría el código para hacer fetch y actualizar el contenedor de productos
        const params = new URLSearchParams(window.location.search); // Define el objeto para manejar los query params
        const desde = params.get('desde') || 0;
        const hasta = params.get('hasta') || 20;
        const precioMin = params.get('precioMin') || '';
        const precioMax = params.get('precioMax') || '';
        const palabraBuscada = params.get('palabraBuscada') || '';
        const categorias = params.get('categorias') || '';
        
        // Realiza la peticion GET para obtener los productos
        fetch(urlProductos+`?desde=${desde}&hasta=${hasta}&precioMin=${precioMin}&precioMax=${precioMax}&palabraBuscada=${palabraBuscada}&categorias=${categorias}`, { 
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
        .finally(()=>{
            ventanaEmergenteProductos();
        })
}

const agregarCategoriasDOM = (categorias: string[]) => {
    const contenedorCategorias: HTMLElement = document.getElementById('catalogo__indice__categorias')!; // Selecciona el contenedor de los filtros de categorias
    const fragmento: DocumentFragment = document.createDocumentFragment(); // Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo
    const params = new URLSearchParams(window.location.search); // Define el objeto para manejar los query params
    let categoriasActivas = params.get('categorias') // Almacena una cadena que contiene las categorias activas

    categorias.forEach((categoria: string ) => { // Recorre los productos

        let agregarCategoria:HTMLElement = document.createElement('button'); // Crea un button para alojar la nueva categoria
        agregarCategoria.textContent=categoria; // Le da el nombre de la categoria actual
        agregarCategoria.classList.add('filtroBoton'); // Le da la clase correspondiente a su funcion
        fragmento.appendChild(agregarCategoria); // Agrega el producto recien creado al fragmento

        // Verificar si la categoria agregada esta activa
        if(categoriasActivas){ // Si hay categorias activas:
            let categoriaActiva = categoriasActivas.includes(categoria) // Verifica que la categoria actual este activa
            if(categoriaActiva){ // Si la categoria esta activa
                agregarCategoria.classList.add('botonActive'); // Le da el estilo de activo
            }
        }

    })
    contenedorCategorias.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo

    // Alterna el "active" de los botones del indice cuando son presionados
    const botonesIndice: NodeListOf<Element> = document.querySelectorAll('.filtroBoton')
    if(botonesIndice[0]){ // Si hay botones en el indice entonces los recorre
        botonesIndice.forEach(botonIndice =>{
            botonIndice.addEventListener('click',()=>{
                botonIndice.classList.toggle(`botonActive`);
                const categoriaPresionada = botonIndice.textContent! // Obtiene la categoria presionada

                const params = new URLSearchParams(window.location.search); // Define el objeto para manejar los query params
                let categoriasActivas = params.get('categorias') // Obtiene las categorias activas

                if(categoriasActivas){// Si hay categorias activas
                    const esActiva = categoriasActivas.includes(categoriaPresionada) // Evalua si la categoria presionada estaba activa
                    if(esActiva){ // Si la categoria presionada estaba activa
                        categoriasActivas = categoriasActivas.replace(categoriaPresionada+',','') // La elimina de las categorias activas
                    }else{ // Si no estaba activa
                        categoriasActivas = categoriasActivas+categoriaPresionada+',' // La agrega
                    }
                }else{ // Si no habia categorias activas entonces
                    categoriasActivas = categoriaPresionada+',' // Define a la categoria presionada como la unica activa
                }

                // Establecer el nuevo valor del parámetro
                urlObjeto.searchParams.set('categorias', categoriasActivas); // Si no existe, lo crea; si existe, lo actualiza
                window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
                
                // Llamar a la función para volver a cargar los productos o actualizar la interfaz
                buscarProductos(); // Asumiendo que tienes una función para cargar los productos
            })
        })
    }
}


//Alternar el active en los botones del indice
document.addEventListener("DOMContentLoaded", async() => {

    if(esDesarollo){ // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
        url = 'http://localhost:8080';
        urlProductos = url + urlProductos;
        urlCategorias = url + urlCategorias;
    }else{ // Si no tiene localhost define el url en la pagina web para la peticion
        url= 'https://embike-223a165b4ff6.herokuapp.com';
        urlProductos=url + urlProductos;
        urlCategorias=url + urlCategorias;
    }

    // Carga las categorias validas en el DOM
    fetch(
        urlCategorias+`?nombres=true`, { // Realiza la peticion GET para obtener un string[] con los nombres de las categorias validas
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
            console.log(data.categorias)
            agregarCategoriasDOM(data.categorias)
        }
    })
    .catch(error => { // Si hay un error se manejan 
        console.error(error);
    })

    buscarProductos();

})

