

// Define el url dependiendo si se esta en produccion o en desarrollo
let urlProductos:string = '/api/productos'
let urlCategorias:string = '/api/categorias'



//Se agrega el comportamiento de cuando se hace click sobre cualquier producto

// Agrega los productos recibidos como parametros al DOM
const agregarProductosDOM = (productos: any[]) => {
    const contenedorProductos: HTMLElement = document.getElementById('catalogo')!; //Toma el catalogo como el contenedor de los productos a agregar
    contenedorProductos.innerHTML='';
    const fragmento: DocumentFragment = document.createDocumentFragment(); //Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo


    productos.forEach((producto: any ) => { // Recorre los productos

        let agregarElemento = document.createElement('div'); // Crea un div para alojar el nuevo producto
        // Verifica que exista una imagen, sino muestra un icono de error
        const imagenProducto = producto.variantes[0].caracteristicas[0].imagenes[0]?producto.variantes[0].caracteristicas[0].imagenes[0]:'../img/catalogoImagenes/icono-sinFoto.avif' 
        agregarElemento.innerHTML=`
        <div class="catalogo__div" id="${producto._id}" data-imagen1="${imagenProducto}" data-nombre="${producto.nombre}" data-precio="$ ${producto.precio}">
        <div class="catalogo__div__imagen" style='background-image: url("${imagenProducto}');"></div>
        <h2 class="catalogo__div__nombre">${producto.nombre}</h2>
        <h3 class="catalogo__div__precio">$ ${(Number(producto.precio)).toLocaleString('es-AR')}</h3>
        <button class="catalogo__div__comprar">Agregar al carro</button>
        </div>
        `;
        fragmento.appendChild(agregarElemento); //Agrega el producto recien creado al fragmento

    })
    contenedorProductos.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo

}

const buscarProductos = ()=>{
        // Vacia el contenedor de productos y coloca una barra de carga
        const contenedorProductos: HTMLElement = document.getElementById('catalogo')!; //Toma el catalogo como el contenedor de los productos a agregar
        contenedorProductos.innerHTML=`<div id="cargandoProductos"></div>`
        
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
        fetch(urlProductos+`?desde=${desde}&hasta=${hasta}&precioMin=${precioMin}&precioMax=${precioMax}&palabraBuscada=${palabraBuscada}&categorias=${categorias}&ordenar=${ordenar}`, { 
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

                if(data.productos[0]){ // Si se encuentran productos para los parametros de busqueda entonces los agrega
                    agregarProductosDOM(data.productos)
                }else{ // Si no se encontraron productos da aviso al usuario
                     // Vacia el contenedor y muestra un mensaje de error
                    contenedorProductos.innerHTML=`
                    <div id="mensajeSinProductos">
                        <div id="mensajeSinProductos__logo"></div>
                        <div id="mensajeSinProductos__mensaje">No se encontraron productos para los parametros de busqueda</div>
                    </div>
                    `
                }
            }
        })
        .catch(error => { // Si hay un error se manejan 
            console.error(error);
        })
        .finally(()=>{
            verProductos(); // Funcion para que cuando se aprete en un producto te reedirija a su pagina con informacion
        })
}

const verProductos =()=>{
    const productos = document.querySelectorAll(".catalogo__div")
    console.log(productos)
    productos.forEach(producto =>{
        producto.addEventListener("click",()=>{
            location.assign(`/producto/${producto.id}`)
        })
    })
}

const agregarCategoriasDOM = (categorias: string[]) => {
    const contenedoresCategorias: NodeListOf<Element> = document.querySelectorAll('.contenedorCategorias')!; // Selecciona los contenedores de los filtros de categorias
    // Recorre los contenedores y agrega las categorias
    contenedoresCategorias.forEach(contenedorCategorias=>{
        const fragmento: DocumentFragment = document.createDocumentFragment(); // Crea un fragmento para alojar todos los elementos antes de agregarlos al catalogo
    
        categorias.forEach((categoria: string ) => { // Recorre los productos
    
            let agregarCategoria:HTMLElement = document.createElement('button'); // Crea un button para alojar la nueva categoria
            agregarCategoria.textContent=categoria; // Le da el nombre de la categoria actual
            agregarCategoria.classList.add('filtroBoton','filtroBotonCategoria'); // Le da la clase correspondiente a su funcion
            fragmento.appendChild(agregarCategoria); // Agrega el producto recien creado al fragmento
    
        })
        contenedorCategorias.appendChild(fragmento); //Agrega el fragmento con todos los productos al catalogo
    })

    // Le da la funcionalidad a los botones de categorias
    const botonesIndice: NodeListOf<Element> = document.querySelectorAll('.filtroBotonCategoria')
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
                const urlObjeto = new URL(window.location.href);
                urlObjeto.searchParams.set('categorias', categoriasActivas); // Si no existe, lo crea; si existe, lo actualiza
                window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
                
                buscarProductos(); // Busca nuevamente los productos en base a los nuevos parametros de busqueda
            })
        })
    }
}

const precioMinMax = () =>{

    const formulariosMinMax:NodeListOf<HTMLFormElement> = document.querySelectorAll(`.formularioMinMax`)! // Selecciona los formularios donde estan los input
    
    // Recorre los formularios y le da las funciones a los input que contiene
    formulariosMinMax.forEach(formularioMinMax =>{
        formularioMinMax.addEventListener('submit',(event)=>{ // Escucha cuando de envia el formulario
            event.preventDefault() // Previe que se recargue la pagina
            
            const inputMax = formularioMinMax.querySelector(".inputPrecioMax")! as HTMLInputElement
            const inputMin = formularioMinMax.querySelector(".inputPrecioMin")! as HTMLInputElement

            // Define los query element 
            const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
            urlObjeto.searchParams.set('precioMin', inputMin.value); // Si no existe, lo crea; si existe, lo actualiza
            urlObjeto.searchParams.set('precioMax', inputMax.value); // Si no existe, lo crea; si existe, lo actualiza
            
            window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
            buscarProductos() // Realiza la busqueda de los productos con el nuevo filtro

            // Si el parametro de busqueda existe entonces refleja el estado activo en los input correspondientes
            if(inputMax.value){ 
                inputMax.classList.add('casillaPrecio-active')
            }else{
                inputMax.classList.remove('casillaPrecio-active')
            }
            if(inputMin.value){ 
                inputMin.classList.add('casillaPrecio-active')
            }else{
                inputMin.classList.remove('casillaPrecio-active')
            }
        })
    })



}

const verificarActive =()=>{ // Verifica que elementos se encuentran activos en el filtrado de productos
    const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente

    // Rango de precios
    const inputMax:NodeListOf<HTMLInputElement> = document.querySelectorAll('.inputPrecioMax')  // Selecciona los input donde se coloca el precio maximo de los productos que se quieren ver
    const inputMin:NodeListOf<HTMLInputElement> = document.querySelectorAll('.inputPrecioMin') // Selecciona los input donde se coloca el precio minimo de los productos que se quieren ver
    const precioMin = urlObjeto.searchParams.get('precioMin'); // Lee si hay un precio minimo buscado
    const precioMax = urlObjeto.searchParams.get('precioMax'); // Lee si hay un precio maximo buscado

    // Si previamente se busco un precio maximo, entonces lo refleja en el input correspondiente
    // Refleja visualmente el estadoa activo del input segun corresponda
    if(precioMax){
        inputMax[0].value = precioMax
        inputMax[1].value = precioMax
        inputMax[0].classList.add('casillaPrecio-active')
        inputMax[1].classList.add('casillaPrecio-active')
    }
    if(precioMin){
        inputMin[0].value = precioMin
        inputMin[1].value = precioMin
        inputMin[0].classList.add('casillaPrecio-active')
        inputMin[1].classList.add('casillaPrecio-active')
    }
    

    // Categorias
    const botonesCategorias:NodeListOf<HTMLButtonElement> = document.querySelectorAll('.filtroBotonCategoria')
    let categoriasActivas = urlObjeto.searchParams.get('categorias') // Almacena una cadena que contiene las categorias activas
    if(categoriasActivas){ // Si hay categorias activas:
        botonesCategorias.forEach(boton=>{ // Recorre cada boton para filtrar las categorias
            const esActivo = categoriasActivas.includes(boton.textContent!); // Verifica si la categoria del boton se encuentra activa
            esActivo?boton.classList.add('botonActive'):''; // Si el boton tiene una categoria activa entonces le da la clase de boton activo
        })
    }
}

// Define la funcion de los botones para ordenar los precios segun el metodo elegido
const ordenarPrecios =()=>{
    
    // Obtiene los botones del DOM
    const botonOrdenarPrecioMax = document.getElementById('li-opciones__ul-precioMax')!
    const botonOrdenarPrecioMin = document.getElementById('li-opciones__ul-precioMin')!
    const botonOrdenarRelevante = document.getElementById('li-opciones__ul-relevante')!

    // Escucha cuando se hace click en ellos y se modifica el query param correspondiente
    botonOrdenarPrecioMax.addEventListener('click',()=>{
        const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
        urlObjeto.searchParams.set('ordenar', 'precioMax'); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto) // Carga los cambios en el URL
        buscarProductos(); // Vuelve a cargar los productos con el nuevo parametro de busqueda
    })
    botonOrdenarPrecioMin.addEventListener('click',()=>{
        const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
        urlObjeto.searchParams.set('ordenar', 'precioMin'); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto) // Carga los cambios en el URL
        buscarProductos(); // Vuelve a cargar los productos con el nuevo parametro de busqueda
    })
    botonOrdenarRelevante.addEventListener('click',()=>{
        const urlObjeto = new URL(window.location.href); // Crea un objeto para definir los query elements mas facilmente
        urlObjeto.searchParams.set('ordenar', ''); // Si no existe, lo crea; si existe, lo actualiza
        window.history.pushState({}, '', urlObjeto) // Carga los cambios en el URL
        buscarProductos(); // Vuelve a cargar los productos con el nuevo parametro de busqueda
    })
}

const filtrosResponsive=()=>{
    const barraLateralResponsive:HTMLElement = document.getElementById('ventanaLateral-Filtros')!
    const botonFiltrosResponsive:HTMLElement = document.getElementById("div-contenedorFiltros__div-filtros")!

    botonFiltrosResponsive.addEventListener('click',(event)=>{
        barraLateralResponsive.classList.add('ventanaLateral-Filtros-active')
        //event.stopPropagation()
        console.log("se muestra")
    })

    const botonVolverBarraLateral:HTMLElement = document.getElementById("ventanaLateral-Filtros__div-volver")!
    botonVolverBarraLateral.addEventListener('click',()=>{
        barraLateralResponsive.classList.remove('ventanaLateral-Filtros-active')

        console.log("se esconde")
    })
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
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor, maneja errores o agrega elementos al DOM
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            agregarCategoriasDOM(data.categorias)
        }
    })
    .then(()=>{ // Una vez que se agregaron los elementos al DOM o se manejaron los errores, verifica los estados activos de los parametros de busqueda, para reflejarlos visualmente
        verificarActive(); // Verifica los estados de los input y los botones para reflejar los pararametros de filtrado

    })
    .catch(error => { // Si hay un error se manejan 
        console.error(error);
    })

    buscarProductos(); // Busca los productos filtrandolos segun los query params
    precioMinMax(); // Le da la funcionalidad a los input de precio maximo y minimo
    ordenarPrecios(); // Define el comportacion de el boton de ordenar productos por precio
    filtrosResponsive(); // Define el comportamiento de la barra lateral de los filtros
})

