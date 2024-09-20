"use strict";
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
document.addEventListener("DOMContentLoaded", function () {
    const filtroCategoriaBoton1 = document.getElementById("filtroCategoriaBoton1");
    const filtroCategoriaBoton2 = document.getElementById("filtroCategoriaBoton2");
    const filtroCategoriaBoton3 = document.getElementById("filtroCategoriaBoton3");
    const filtroCategoriaBoton4 = document.getElementById("filtroCategoriaBoton4");
    filtroCategoriaBoton1.addEventListener("click", function () {
        filtroCategoriaBoton1.classList.toggle(`botonActive`);
    });
    filtroCategoriaBoton2.addEventListener("click", function () {
        filtroCategoriaBoton2.classList.toggle(`botonActive`);
    });
    filtroCategoriaBoton3.addEventListener("click", function () {
        filtroCategoriaBoton3.classList.toggle(`botonActive`);
    });
    filtroCategoriaBoton4.addEventListener("click", function () {
        filtroCategoriaBoton4.classList.toggle(`botonActive`);
    });
    const filtroRodadoBoton1 = document.getElementById("filtroRodadoBoton1");
    const filtroRodadoBoton2 = document.getElementById("filtroRodadoBoton2");
    const filtroRodadoBoton3 = document.getElementById("filtroRodadoBoton3");
    const filtroRodadoBoton4 = document.getElementById("filtroRodadoBoton4");
    const filtroRodadoBoton5 = document.getElementById("filtroRodadoBoton5");
    filtroRodadoBoton1.addEventListener("click", function () {
        filtroRodadoBoton1.classList.toggle(`botonActive`);
    });
    filtroRodadoBoton2.addEventListener("click", function () {
        filtroRodadoBoton2.classList.toggle(`botonActive`);
    });
    filtroRodadoBoton3.addEventListener("click", function () {
        filtroRodadoBoton3.classList.toggle(`botonActive`);
    });
    filtroRodadoBoton4.addEventListener("click", function () {
        filtroRodadoBoton4.classList.toggle(`botonActive`);
    });
    filtroRodadoBoton5.addEventListener("click", function () {
        filtroRodadoBoton5.classList.toggle(`botonActive`);
    });
});
