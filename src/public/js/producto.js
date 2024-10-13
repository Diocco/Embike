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
const cargarInformacionProducto = (productoInformacion) => {
    const productoImagen = document.getElementById('catalogoProducto__imagen');
    productoImagen.style.backgroundImage = `url(${productoInformacion.variantes[0].caracteristicas[0].imagenes[0]})`;
    let productoNombre = document.getElementById('catalogoProducto__titulo');
    productoNombre.textContent = productoInformacion.nombre;
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
    let productoPrecio = document.getElementById('catalogoProducto__precio');
    productoPrecio.textContent = `$ ${(Number(productoInformacion.precio)).toLocaleString('es-AR')}`; // Coloca el precio del producto con formato precio
    let descripcionProducto = document.getElementById('contenedorDescripcion__p');
    descripcionProducto.textContent = productoInformacion.descripcion;
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
                cargarInformacionProducto(data);
            }
        });
    }
    // Le da la funcion al boton de volver
    const botonVolver = document.getElementById("catalogoProducto__volver");
    botonVolver.addEventListener('click', () => {
        window.history.back(); // Retrocede a la pagina anterior
    });
    // Le da funcion al boton de agregar a la lista de deseados
    const botonAgregarDeseados = document.getElementById("botonAgregarDeseados");
    botonAgregarDeseados.addEventListener('click', () => {
        botonAgregarDeseados.classList.toggle('botonAgregarDeseados-push');
        botonAgregarDeseados.classList.toggle('botonAgregarDeseados-active');
    });
}));
