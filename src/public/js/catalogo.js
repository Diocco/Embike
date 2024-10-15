var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { agregarProductosDOM } from "./helpers/agregarProductosDOM.js";
// Define el entorno
let url;
const esDesarollo = window.location.hostname.includes('localhost'); // Revisa el url actual
if (esDesarollo) { // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
    url = 'http://localhost:8080';
}
else { // Si no tiene localhost define el url en la pagina web para la peticion
    url = 'https://embike-223a165b4ff6.herokuapp.com';
}
// Define el url dependiendo si se esta en produccion o en desarrollo
let urlProductos = '/api/productos';
let urlCategorias = '/api/categorias';
//Se agrega el comportamiento de cuando se hace click sobre cualquier producto
export const buscarProductos = () => {
    // Vacia el contenedor de productos y coloca una barra de carga
    const contenedorProductos = document.getElementById('catalogo'); //Toma el catalogo como el contenedor de los productos a agregar
    contenedorProductos.innerHTML = `<div id="cargandoProductos"></div>`; // Muestra el icono de carga 
    contenedorProductos.classList.add('catalogo-conMensaje'); // Centra el icono de carga
    // Define los query params para enviarlos en el fetch y asi filtrar los productos
    const params = new URLSearchParams(window.location.search);
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
            if (data.productos[0]) { // Si se encuentran productos para los parametros de busqueda entonces los agrega
                contenedorProductos.classList.remove('catalogo-conMensaje');
                agregarProductosDOM(data.productos, contenedorProductos);
            }
            else { // Si no se encontraron productos da aviso al usuario
                // Vacia el contenedor y muestra un mensaje de error
                contenedorProductos.innerHTML = `
                    <div id="mensajeSinProductos">
                        <div id="mensajeSinProductos__logo"></div>
                        <div id="mensajeSinProductos__mensaje">No se encontraron productos para los parametros de busqueda</div>
                    </div>
                    `;
            }
        }
    })
        .catch(error => {
        console.error(error);
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
            // Si el parametro de busqueda existe entonces refleja el estado activo en los input correspondientes
            if (inputMax.value) {
                inputMax.classList.add('casillaPrecio-active');
            }
            else {
                inputMax.classList.remove('casillaPrecio-active');
            }
            if (inputMin.value) {
                inputMin.classList.add('casillaPrecio-active');
            }
            else {
                inputMin.classList.remove('casillaPrecio-active');
            }
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
    // Si previamente se busco un precio maximo, entonces lo refleja en el input correspondiente
    // Refleja visualmente el estado activo del input segun corresponda
    if (precioMax) {
        inputMax[0].value = precioMax;
        inputMax[1].value = precioMax;
        inputMax[0].classList.add('casillaPrecio-active');
        inputMax[1].classList.add('casillaPrecio-active');
    }
    if (precioMin) {
        inputMin[0].value = precioMin;
        inputMin[1].value = precioMin;
        inputMin[0].classList.add('casillaPrecio-active');
        inputMin[1].classList.add('casillaPrecio-active');
    }
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
    // Obtiene los botones del DOM
    const botonesOrdenarPrecioMax = document.querySelectorAll('.li-opciones__ul-precioMax');
    const botonesOrdenarPrecioMin = document.querySelectorAll('.li-opciones__ul-precioMin');
    const botonesOrdenarRelevante = document.querySelectorAll('.li-opciones__ul-relevante');
    const ordenar = (tipo) => {
        const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
        urlObjeto.searchParams.set('ordenar', tipo); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto); // Carga los cambios en el URL
        buscarProductos(); // Vuelve a cargar los productos con el nuevo parametro de busqueda
    };
    // Escucha cuando se hace click en ellos y se modifica el query param correspondiente
    botonesOrdenarPrecioMax[0].addEventListener('click', () => {
        console.log("Se apreto");
        ordenar('precioMax');
    });
    botonesOrdenarPrecioMax[1].addEventListener('click', () => {
        console.log("Se apreto");
        ordenar('precioMax');
    });
    botonesOrdenarPrecioMin[0].addEventListener('click', () => {
        ordenar('precioMin');
    });
    botonesOrdenarPrecioMin[1].addEventListener('click', () => {
        ordenar('precioMin');
    });
    botonesOrdenarRelevante[0].addEventListener('click', () => {
        ordenar('');
    });
    botonesOrdenarRelevante[1].addEventListener('click', () => {
        ordenar('');
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
