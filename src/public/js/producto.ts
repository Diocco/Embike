const cargarInformacionProducto =(productoInformacion:any)=>{
    const productoImagen = document.getElementById('catalogoProducto__imagen')!
    productoImagen.style.backgroundImage=`url(${productoInformacion.variantes[0].caracteristicas[0].imagenes[0]})`;

    let productoNombre = document.getElementById('catalogoProducto__titulo')!
    productoNombre.textContent = productoInformacion.nombre

    let productoPrecio = document.getElementById('catalogoProducto__precio')!
    productoPrecio.textContent = `$ ${(Number(productoInformacion.precio)).toLocaleString('es-AR')}` // Coloca el precio del producto con formato precio

    let descripcionProducto = document.getElementById('contenedorDescripcion__p')!
    descripcionProducto.textContent = productoInformacion.descripcion


    // Carga los colores y talles
    const coloresUnicos: Set<string> = new Set(); // Usamos un Set para almacenar colores únicos
    const tallesUnicos: Set<string> = new Set(); // Usamos un Set para almacenar talles únicos

    productoInformacion.variantes.forEach((variante: { color: string; caracteristicas: any[]; }) => {
        // Agregar el color al Set de colores únicos
        coloresUnicos.add(variante.color);
        console.log("La variante con el color: " + variante.color + " tiene los talles:");

        // Cargar talles
        variante.caracteristicas.forEach(caracteristica => {
            // Agregar el talle al Set de talles únicos
            tallesUnicos.add(caracteristica.talle);
            console.log(caracteristica.talle);
        });
    });


    // Convertir los Sets a arrays si necesitas arrays en lugar de Sets
    const coloresArray = Array.from(coloresUnicos);
    const tallesArray = Array.from(tallesUnicos);

    // Opcional: Imprimir los resultados
    console.log("Colores únicos:", coloresArray);
    console.log("Talles únicos:", tallesArray);

    // Agrega los colores al DOM
    const contenedorColores = document.getElementById('catalogoProducto__colores-contenedor')!
    let fragmento = document.createDocumentFragment();
    coloresArray.forEach(color=>{
        const nuevocolor = document.createElement('div')
        nuevocolor.style.backgroundColor=color;
        nuevocolor.classList.add('opcionesProductos__opcion');
        fragmento.appendChild(nuevocolor)
    })
    contenedorColores.appendChild(fragmento)

    // Agrega los talles al DOM
    const contenedorTalles = document.getElementById('catalogoProducto__talles-contenedor')!
    fragmento = document.createDocumentFragment();
    tallesArray.forEach(talle=>{
        const nuevoTalle = document.createElement('div')
        nuevoTalle.textContent=talle;
        nuevoTalle.classList.add('opcionesProductos__opcion');
        fragmento.appendChild(nuevoTalle)
    })
    contenedorTalles.appendChild(fragmento)

    // Carga las especificaciones del producto
    let contenedorespEspecificaciones = document.getElementById('informacionGeneralProducto__div-especificaciones')!
    let especificacionesProducto = Object.entries(productoInformacion.especificaciones)

    especificacionesProducto.forEach(especificacion =>{
        const especificacionNombre = especificacion[0];
        const especificacionValor = especificacion[1];
        const HTMLProducto:string = `<h4 class="div-especificaciones__h4">${especificacionNombre}</h4>
                                    <p class="div-especificaciones__p">${especificacionValor}</p>`
        contenedorespEspecificaciones.innerHTML = contenedorespEspecificaciones.innerHTML + HTMLProducto

    })
    
}


document.addEventListener("DOMContentLoaded",async()=>{

    // Extrae el id del URL
    const idProducto = window.location.pathname.split('/').pop(); 

    if(!idProducto){ // Si el URL no tiene el id entonces lanza un error
        console.log('Id no valido')
    }else{// Si el URL tiene un id entonces realiza un fetch
        fetch(url+`/api/productos/${idProducto}`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
        })
        .then(response => response.json()) // Parsea la respuesta 
        .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
            if(data.errors){ // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
                (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                    console.log(error.msg)})
            }else{ // Si no hay errores:
                cargarInformacionProducto(data)
            }
        })
    }

    // Le da la funcion al boton de volver
    const botonVolver:HTMLElement = document.getElementById("catalogoProducto__volver")!
    botonVolver.addEventListener('click',()=>{
            window.history.back() // Retrocede a la pagina anterior
    })

    // Le da funcion al boton de agregar a la lista de deseados
    const botonAgregarDeseados:HTMLElement = document.getElementById("botonAgregarDeseados")!
    botonAgregarDeseados.addEventListener('click',()=>{
        botonAgregarDeseados.classList.toggle('botonAgregarDeseados-push')
        botonAgregarDeseados.classList.toggle('botonAgregarDeseados-active')
    })
















})