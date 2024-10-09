"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Define el url dependiendo si se esta en produccion o en desarrollo
let urlProductos = '/api/productos';
let urlCategorias = '/api/categorias';
//Se agrega el comportamiento de cuando se hace click sobre cualquier producto
const ventanaEmergenteProductos = () => {
    //Se configura el comportamiento de la ventana
    const productosCargados = document.querySelectorAll('.catalogo__div'); // Crea un array con los nodos de los productos existentes en el DOM
    const ventanaEmergenteProducto = document.getElementById("catalogoProducto"); // Ventana emergente donde aparece toda la informacion del producto seleccionado
    const catalogo__fondo = document.getElementById("catalogo__fondo"); // Fondo de la ventana emergente
    const catalogoProducto__imagen = document.getElementById("catalogoProducto__imagen"); // Imagen del producto seleccionado dentro de la ventana emergente
    const titulo = document.getElementById("catalogoProducto__titulo"); // Nombre del producto seleccionado dentro de la ventana emergente
    const precio = document.getElementById("catalogoProducto__precio"); // Precio del producto seleccionado dentro de la ventana emergente
    const catalogoProducto__salir = document.getElementById("catalogoProducto__salir"); // Boton de salir dentro de la ventana emergente
    //Recorre los productos cargados en el catalogo para darle funcionalidad
    productosCargados.forEach(producto => {
        producto.addEventListener("click", () => {
            titulo.textContent = producto.dataset.nombre; // Define el nombre del producto seleccionado dentro de la ventana emergente
            precio.textContent = producto.dataset.precio; // Define el precio del producto seleccionado dentro de la ventana emergente
            catalogoProducto__imagen.style.backgroundImage = `url("${producto.dataset.imagen1}")`; // Define la imagen del producto seleccionado dentro de la ventana emergente
            ventanaEmergenteProducto.classList.toggle("catalogoProducto-active"); // Muestra la ventana emergente
            catalogo__fondo.classList.toggle("catalogo__fondo-active"); // Oscurece el fondo de la ventana emergente
        });
    });
    // Funciones para cerrar la ventana emergente
    //Comportamiento de el boton de salir
    catalogoProducto__salir.addEventListener("click", () => {
        catalogo__fondo.classList.toggle("catalogo__fondo-active"); // Esconde la ventana emergente
        ventanaEmergenteProducto.classList.toggle("catalogoProducto-active"); // Vuelve el color del fondo de la ventana emergente a la normalidad
    });
    //Comportamiento del fondo
    catalogo__fondo.addEventListener("click", () => {
        catalogo__fondo.classList.toggle("catalogo__fondo-active"); // Esconde la ventana emergente
        ventanaEmergenteProducto.classList.toggle("catalogoProducto-active"); // Vuelve el color del fondo de la ventana emergente a la normalidad
    });
};
// Agrega los productos recibidos como parametros al DOM
const agregarProductosDOM = (productos) => {
    const contenedorProductos = document.getElementById('catalogo'); //Toma el catalogo como el contenedor de los productos a agregar
    contenedorProductos.innerHTML = ''; // Vacia el contenedor para agregar nuevos productos
    const fragmento = document.createDocumentFragment(); //Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo
    productos.forEach((producto) => {
        let agregarElemento = document.createElement('div'); // Crea un div para alojar el nuevo producto
        agregarElemento.innerHTML = `
        <div class="catalogo__div" id="${producto._id}" data-imagen1="${producto.imagenes[0]}" data-nombre="${producto.nombre}" data-precio="$ ${producto.precio}">
        <div class="catalogo__div__imagen" style='background-image: url("${producto.imagenes[0]}');"></div>
        <h2 class="catalogo__div__nombre">${producto.nombre}</h2>
        <h3 class="catalogo__div__precio">$ ${producto.precio}</h3>
        <button class="catalogo__div__comprar">Agregar al carro</button>
        </div>
        `;
        fragmento.appendChild(agregarElemento); //Agrega el producto recien creado al fragmento
    });
    contenedorProductos.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo
};
const buscarProductos = () => {
    // Aquí iría el código para hacer fetch y actualizar el contenedor de productos
    const params = new URLSearchParams(window.location.search); // Define el objeto para manejar los query params
    const desde = params.get('desde') || 0;
    const hasta = params.get('hasta') || 20;
    const precioMin = params.get('precioMin') || '';
    const precioMax = params.get('precioMax') || '';
    const palabraBuscada = params.get('palabraBuscada') || '';
    const categorias = params.get('categorias') || '';
    const ordenar = params.get('ordenar') || '';
    // Realiza la peticion GET para obtener los productos
    fetch(urlProductos + `?desde=${desde}&hasta=${hasta}&precioMin=${precioMin}&precioMax=${precioMax}&palabraBuscada=${palabraBuscada}&categorias=${categorias}&ordenar=${ordenar}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json()) // Parsear la respuesta como JSON
        .then(data => {
        if (data.errors) { // Si el servidor devuelve errores los muestra segun corresponda
            (data.errors).forEach((error) => {
                console.log(error);
            });
        }
        else { // Si el servidor no devuelve errores:
            console.log(data.productos);
            agregarProductosDOM(data.productos);
        }
    })
        .catch(error => {
        console.error(error);
    })
        .finally(() => {
        ventanaEmergenteProductos();
    });
};
const agregarCategoriasDOM = (categorias) => {
    const contenedoresCategorias = document.querySelectorAll('.contenedorCategorias'); // Selecciona los contenedores de los filtros de categorias
    // Recorre los contenedores y agrega las categorias
    contenedoresCategorias.forEach(contenedorCategorias => {
        const fragmento = document.createDocumentFragment(); // Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo
        categorias.forEach((categoria) => {
            let agregarCategoria = document.createElement('button'); // Crea un button para alojar la nueva categoria
            agregarCategoria.textContent = categoria; // Le da el nombre de la categoria actual
            agregarCategoria.classList.add('filtroBoton', 'filtroBotonCategoria'); // Le da la clase correspondiente a su funcion
            fragmento.appendChild(agregarCategoria); // Agrega el producto recien creado al fragmento
        });
        contenedorCategorias.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo
    });
    // Le da la funcionalidad a los botones de categorias
    const botonesIndice = document.querySelectorAll('.filtroBotonCategoria');
    if (botonesIndice[0]) { // Si hay botones en el indice entonces los recorre
        botonesIndice.forEach(botonIndice => {
            botonIndice.addEventListener('click', () => {
                botonIndice.classList.toggle(`botonActive`);
                const categoriaPresionada = botonIndice.textContent; // Obtiene la categoria presionada
                const params = new URLSearchParams(window.location.search); // Define el objeto para manejar los query params
                let categoriasActivas = params.get('categorias'); // Obtiene las categorias activas
                if (categoriasActivas) { // Si hay categorias activas
                    const esActiva = categoriasActivas.includes(categoriaPresionada); // Evalua si la categoria presionada estaba activa
                    if (esActiva) { // Si la categoria presionada estaba activa
                        categoriasActivas = categoriasActivas.replace(categoriaPresionada + ',', ''); // La elimina de las categorias activas
                    }
                    else { // Si no estaba activa
                        categoriasActivas = categoriasActivas + categoriaPresionada + ','; // La agrega
                    }
                }
                else { // Si no habia categorias activas entonces
                    categoriasActivas = categoriaPresionada + ','; // Define a la categoria presionada como la unica activa
                }
                // Establecer el nuevo valor del parámetro
                const urlObjeto = new URL(window.location.href);
                urlObjeto.searchParams.set('categorias', categoriasActivas); // Si no existe, lo crea; si existe, lo actualiza
                window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
                buscarProductos(); // Busca nuevamente los productos en base a los nuevos parametros de busqueda
            });
        });
    }
};
const precioMinMax = () => {
    const formulariosMinMax = document.querySelectorAll(`.formularioMinMax`); // Selecciona los formularios donde estan los input
    // Recorre los formularios y le da las funciones a los input que contiene
    formulariosMinMax.forEach(formularioMinMax => {
        formularioMinMax.addEventListener('submit', (event) => {
            event.preventDefault(); // Previe que se recargue la pagina
            const inputMax = formularioMinMax.querySelector(".inputPrecioMax");
            const inputMin = formularioMinMax.querySelector(".inputPrecioMin");
            // Define los query element 
            const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
            urlObjeto.searchParams.set('precioMin', inputMin.value); // Si no existe, lo crea; si existe, lo actualiza
            urlObjeto.searchParams.set('precioMax', inputMax.value); // Si no existe, lo crea; si existe, lo actualiza
            window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
            buscarProductos(); // Realiza la busqueda de los productos con el nuevo filtro
        });
    });
};
const verificarActive = () => {
    const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
    // Rango de precios
    const inputMax = document.querySelectorAll('.inputPrecioMax'); // Selecciona los input donde se coloca el precio maximo de los productos que se quieren ver
    const inputMin = document.querySelectorAll('.inputPrecioMin'); // Selecciona los input donde se coloca el precio minimo de los productos que se quieren ver
    const precioMin = urlObjeto.searchParams.get('precioMin'); // Lee si hay un precio minimo buscado
    const precioMax = urlObjeto.searchParams.get('precioMax'); // Lee si hay un precio maximo buscado
    precioMax ? inputMax[0].value = precioMax : ''; // Si previamente se busco un precio maximo, entonces lo refleja en el input correspondiente
    precioMin ? inputMin[0].value = precioMin : ''; // Si previamente se busco un precio minimo, entonces lo refleja en el input correspondiente
    precioMax ? inputMax[1].value = precioMax : ''; // Si previamente se busco un precio maximo, entonces lo refleja en el input correspondiente
    precioMin ? inputMin[1].value = precioMin : ''; // Si previamente se busco un precio minimo, entonces lo refleja en el input correspondiente
    // Categorias
    const botonesCategorias = document.querySelectorAll('.filtroBotonCategoria');
    let categoriasActivas = urlObjeto.searchParams.get('categorias'); // Almacena una cadena que contiene las categorias activas
    if (categoriasActivas) { // Si hay categorias activas:
        botonesCategorias.forEach(boton => {
            const esActivo = categoriasActivas.includes(boton.textContent); // Verifica si la categoria del boton se encuentra activa
            esActivo ? boton.classList.add('botonActive') : ''; // Si el boton tiene una categoria activa entonces le da la clase de boton activo
        });
    }
};
// Define la funcion de los botones para ordenar los precios segun el metodo elegido
const ordenarPrecios = () => {
    const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
    // Obtiene los botones del DOM
    const botonOrdenarPrecioMax = document.getElementById('li-opciones__ul-precioMax');
    const botonOrdenarPrecioMin = document.getElementById('li-opciones__ul-precioMin');
    const botonOrdenarRelevante = document.getElementById('li-opciones__ul-relevante');
    // Escucha cuando se hace click en ellos y se modifica el query param correspondiente
    botonOrdenarPrecioMax.addEventListener('click', () => {
        urlObjeto.searchParams.set('ordenar', 'precioMax'); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto); // Carga los cambios en el URL
        buscarProductos(); // Vuelve a cargar los productos con el nuevo parametro de busqueda
    });
    botonOrdenarPrecioMin.addEventListener('click', () => {
        urlObjeto.searchParams.set('ordenar', 'precioMin'); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto); // Carga los cambios en el URL
        buscarProductos(); // Vuelve a cargar los productos con el nuevo parametro de busqueda
    });
    botonOrdenarRelevante.addEventListener('click', () => {
        urlObjeto.searchParams.set('ordenar', ''); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto); // Carga los cambios en el URL
        buscarProductos(); // Vuelve a cargar los productos con el nuevo parametro de busqueda
    });
};
const filtrosResponsive = () => {
    const barraLateralResponsive = document.getElementById('ventanaLateral-Filtros');
    const botonFiltrosResponsive = document.getElementById("div-contenedorFiltros__div-filtros");
    botonFiltrosResponsive.addEventListener('click', (event) => {
        barraLateralResponsive.classList.add('ventanaLateral-Filtros-active');
        //event.stopPropagation()
        console.log("se muestra");
    });
    const botonVolverBarraLateral = document.getElementById("ventanaLateral-Filtros__div-volver");
    botonVolverBarraLateral.addEventListener('click', () => {
        barraLateralResponsive.classList.remove('ventanaLateral-Filtros-active');
        console.log("se esconde");
    });
};
//Alternar el active en los botones del indice
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    if (esDesarollo) { // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
        url = 'http://localhost:8080';
        urlProductos = url + urlProductos;
        urlCategorias = url + urlCategorias;
    }
    else { // Si no tiene localhost define el url en la pagina web para la peticion
        url = 'https://embike-223a165b4ff6.herokuapp.com';
        urlProductos = url + urlProductos;
        urlCategorias = url + urlCategorias;
    }
    // Carga las categorias validas en el DOM
    fetch(urlCategorias + `?nombres=true`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json()) // Parsear la respuesta como JSON
        .then(data => {
        if (data.errors) { // Si el servidor devuelve errores los muestra segun corresponda
            (data.errors).forEach((error) => {
                console.log(error);
            });
        }
        else { // Si el servidor no devuelve errores:
            agregarCategoriasDOM(data.categorias);
        }
    })
        .then(() => {
        verificarActive(); // Verifica los estados de los input y los botones para reflejar los pararametros de filtrado
    })
        .catch(error => {
        console.error(error);
    });
    buscarProductos(); // Busca los productos filtrandolos segun los query params
    precioMinMax(); // Le da la funcionalidad a los input de precio maximo y minimo
    ordenarPrecios(); // Define el comportacion de el boton de ordenar productos por precio
    filtrosResponsive(); // Define el comportamiento de la barra lateral de los filtros
}));
