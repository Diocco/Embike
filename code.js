//Boton de agregar elementos al catalogo//
document.addEventListener("DOMContentLoaded", function() {
    var botonAgregarAlCatalogo = document.getElementById("catalogo__div-modificar__button-agregar");
    var catalogo = document.getElementById("catalogo");
    let elementoNumero = 6;

    botonAgregarAlCatalogo.addEventListener("click", function() {
        // Crear un nuevo elemento
        let nombre=prompt("Ingrese el nombre del producto");
        let precio=prompt("Ingrese el precio del producto");
        elementoNumero++;

        var nuevoProducto = document.createElement("div");
        nuevoProducto.setAttribute("class","catalogo__div");
        nuevoProducto.setAttribute("id",`catalogo__elemento${elementoNumero}`);
        nuevoProducto.innerHTML = `
            <img class="catalogo__div__imagen" src="catalogoImagenes/bici.png">
            <h2 class="catalogo__div__nombre">${nombre}</h2>
            <h3 class="catalogo__div__precio">$${precio}</h3>
            <button class="catalogo__div__comprar">Agregar al carro</button>
        `;
        // Agregar el nuevo elemento al contenedor
        catalogo.appendChild(nuevoProducto);
    });
});