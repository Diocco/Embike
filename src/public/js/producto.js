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
// Define el entorno
let url;
const esDesarollo = window.location.hostname.includes('localhost'); // Revisa el url actual
if (esDesarollo) { // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
    url = 'http://localhost:8080';
}
else { // Si no tiene localhost define el url en la pagina web para la peticion
    url = 'https://embike-223a165b4ff6.herokuapp.com';
}
const cargarColoresTalles = (productoInformacion) => {
    // Carga los colores y talles
    const coloresUnicos = new Set(); // Usamos un Set para almacenar colores únicos
    const tallesUnicos = new Set(); // Usamos un Set para almacenar talles únicos
    productoInformacion.variantes.forEach((variante) => {
        // Agregar el color al Set de colores únicos
        coloresUnicos.add(variante.color);
        console.log("La variante con el color: " + variante.color + " tiene los talles:");
        // Cargar talles
        variante.caracteristicas.forEach(caracteristica => {
            // Agregar el talle al Set de talles únicos
            tallesUnicos.add(caracteristica.talle);
        });
    });
    // Convertir los Sets a arrays 
    const coloresArray = Array.from(coloresUnicos);
    const tallesArray = Array.from(tallesUnicos);
    // Agrega los colores al DOM
    const contenedorColores = document.getElementById('catalogoProducto__colores-contenedor');
    let fragmento = document.createDocumentFragment();
    coloresArray.forEach(color => {
        const nuevocolor = document.createElement('div');
        nuevocolor.style.backgroundColor = color;
        nuevocolor.classList.add('opcionesProductos__opcion');
        fragmento.appendChild(nuevocolor);
    });
    contenedorColores.appendChild(fragmento);
    // Agrega los talles al DOM
    const contenedorTalles = document.getElementById('catalogoProducto__talles-contenedor');
    fragmento = document.createDocumentFragment();
    tallesArray.forEach(talle => {
        const nuevoTalle = document.createElement('div');
        nuevoTalle.textContent = talle;
        nuevoTalle.classList.add('opcionesProductos__opcion');
        fragmento.appendChild(nuevoTalle);
    });
    contenedorTalles.appendChild(fragmento);
};
const verificarListaDeseados = (productoInformacion) => {
    // Refleja si el producto esta o no en la lista de deseados
    // Le da funcion al boton de agregar a la lista de deseados
    const botonAgregarDeseados = document.getElementById("botonAgregarDeseados");
    botonAgregarDeseados.addEventListener('click', () => {
        botonAgregarDeseados.classList.toggle('botonAgregarDeseados-push');
        botonAgregarDeseados.classList.toggle('botonAgregarDeseados-active');
        fetch(url + `/api/usuarios/listaDeseados/${productoInformacion._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',
                'tokenAcceso': `${localStorage.getItem('tokenAcceso')}` // Envia el token de acceso del usuario
            }
        })
            .then(response => response.json())
            .then(data => {
            if (data.errors) { // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
                (data.errors).forEach((error) => {
                    console.log(error.msg);
                });
            }
            else { // No se espera una respuesta del servidor que no sean errores en este caso
            }
        })
            .catch(error => {
            console.error(error);
        });
    });
    // Manda una solicitud al servidor para saber la lista de deseados del usuario
    let listaProductosDeseados;
    fetch(url + `/api/usuarios/listaDeseados`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
            'tokenAcceso': `${localStorage.getItem('tokenAcceso')}` // Envia el token de acceso del usuario
        }
    })
        .then(response => response.json())
        .then(data => {
        if (data.errors) { // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
            (data.errors).forEach((error) => {
                console.log(error.msg);
            });
        }
        else {
            listaProductosDeseados = data;
            // Busca el producto actual en la lista del usuario
            const indice = listaProductosDeseados.indexOf(productoInformacion._id);
            if (indice === -1) {
                // Si no se encuentra el id del producto en la lista del usuario entonces no hace nada
            }
            else {
                // Si se encuentra entonces lo refleja visualmente
                const botonAgregarDeseados = document.getElementById("botonAgregarDeseados");
                botonAgregarDeseados.classList.add('botonAgregarDeseados-active');
                botonAgregarDeseados.classList.add('botonAgregarDeseados-push');
            }
        }
    })
        .catch(error => {
        console.error(error);
    });
};
const cargarInformacionProducto = (productoInformacion) => {
    // Carga la imagen del producto
    const productoImagen = document.getElementById('catalogoProducto__imagen');
    productoImagen.style.backgroundImage = `url(${productoInformacion.variantes[0].caracteristicas[0].imagenes[0]})`;
    // Carga el nombre del producto
    let productoNombre = document.getElementById('catalogoProducto__titulo');
    productoNombre.textContent = productoInformacion.nombre;
    // Carga el descuento del producto
    const tieneDescuento = productoInformacion.precioViejo ? true : false;
    if (tieneDescuento) {
        const precio = (Number(productoInformacion.precio));
        const precioViejo = (Number(productoInformacion.precioViejo));
        const porcentajeDescuento = Math.floor((1 - precio / precioViejo) * 100);
        const contenedorPrecioViejo = document.querySelector(".descuento__precioViejo");
        const contenedorPorcentaje = document.querySelector(".descuento__porcentaje");
        contenedorPrecioViejo.textContent = `$ ${(Number(precioViejo)).toLocaleString('es-AR')}`;
        contenedorPorcentaje.textContent = ` ${Math.abs(porcentajeDescuento)}% OFF!`;
    }
    // Carga el precio del producto
    let productoPrecio = document.getElementById('catalogoProducto__precio');
    productoPrecio.textContent = `$ ${(Number(productoInformacion.precio)).toLocaleString('es-AR')}`; // Coloca el precio del producto con formato precio
    // Carga la descripcion del producto
    let descripcionProducto = document.getElementById('contenedorDescripcion__p');
    descripcionProducto.textContent = productoInformacion.descripcion;
    // Carga las especificaciones del producto
    let contenedorespEspecificaciones = document.getElementById('informacionGeneralProducto__div-especificaciones');
    let especificacionesProducto = Object.entries(productoInformacion.especificaciones);
    especificacionesProducto.forEach(especificacion => {
        const especificacionNombre = especificacion[0];
        const especificacionValor = especificacion[1];
        const HTMLProducto = `<h4 class="div-especificaciones__h4">${especificacionNombre}</h4>
                                    <p class="div-especificaciones__p">${especificacionValor}</p>`;
        contenedorespEspecificaciones.innerHTML = contenedorespEspecificaciones.innerHTML + HTMLProducto;
    });
};
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    // Extrae el id del URL
    const idProducto = window.location.pathname.split('/').pop();
    if (!idProducto) { // Si el URL no tiene el id entonces lanza un error
        console.log('Id no valido');
    }
    else { // Si el URL tiene un id entonces realiza un fetch
        fetch(url + `/api/productos/${idProducto}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json()) // Parsea la respuesta 
            .then(data => {
            if (data.errors) { // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
                (data.errors).forEach((error) => {
                    console.log(error.msg);
                });
            }
            else { // Si no hay errores:
                cargarInformacionProducto(data); // Carga la informacion general del producto en el DOM
                cargarColoresTalles(data); // Carga las variantes de colores y talles del producto
                verificarListaDeseados(data); // Le define la funcion al boton de agregar el producto a la lista de deseados y verifica si el producto ya forma parte o no de la lista
            }
        });
    }
    // Le da la funcion al boton de volver
    const botonVolver = document.getElementById("catalogoProducto__volver");
    botonVolver.addEventListener('click', () => {
        window.history.back(); // Retrocede a la pagina anterior
    });
}));
