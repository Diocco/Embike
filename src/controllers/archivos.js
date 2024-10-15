const cargarCatalogo = (req, res) => {
    res.render("catalogo.hbs");
};
const cargarIndex = (req, res) => {
    res.render("index.hbs");
};
const cargarInicioSesion = (req, res) => {
    res.render("inicioSesion.hbs");
};
const cargarNotFound = (req, res) => {
    res.render("notFound.hbs");
};
const cargarProducto = (req, res) => {
    res.render("producto.hbs");
};
const cargarListaDeseados = (req, res) => {
    res.render("listaDeseados.hbs");
};
export { cargarCatalogo, cargarIndex, cargarNotFound, cargarInicioSesion, cargarProducto, cargarListaDeseados };
