import { urlCategorias } from "../registener.js";
import { mostrarMensaje } from "../helpers/mostrarMensaje.js";
import { buscarProductos } from "../helpers/productos.js";

export const buscarCategorias = async(contenedor:HTMLElement|null=null): Promise<string[]|undefined> =>{
    return fetch(
        urlCategorias + `?nombres=true`, { // Realiza la peticion GET para obtener un string[] con los nombres de las categorias validas
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor, maneja errores o agrega elementos al DOM
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
            return undefined
        }else{ // Si el servidor no devuelve errores:
            const nombreCategorias:string[] = data.categorias
            if(contenedor) cargarCategoriasEncontradas(nombreCategorias,contenedor) // Si se paso un contenedor como argumento entonces llama a la funcion para cargar las categorias en el DOM
            return nombreCategorias
        }
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true)
        console.error(error);
        return undefined
    })
}

export function cargarCategoriasEncontradas(nombresCategorias:string[],contenedorCategorias:HTMLElement) {

    // Agrega las categorias al DOM
    const fragmento = document.createDocumentFragment()
    for (let i = 0; i < nombresCategorias.length; i++) {
        let categoriaDIV:HTMLDivElement = document.createElement(`div`); //Crea el contenedor para los productos de una misma categoria
        categoriaDIV.textContent=nombresCategorias[i]; // Le da el mismo nombre que el de la categoria
        categoriaDIV.classList.add('categorias__div') // Le da la clase de boton de categoria
        if(esCategoriaActiva(nombresCategorias[i])) categoriaDIV.classList.add('botonPositivo') // Evalua si la categoria esta activa, si lo esta, le da el estilo de categoria activa

        fragmento.appendChild(categoriaDIV); // Agrega la categoria al fragmento
    }
    contenedorCategorias.appendChild(fragmento); // Inserta todas las categorias al DOM

    // Les asigna la funcion cuando se les hace click
    const categorias: NodeListOf<HTMLDivElement> = contenedorCategorias.querySelectorAll('.categorias__div')  // Selecciona todos los nodos de categorias agregados
    categorias.forEach(categoria => {// Recorre los contenedores de categorias
        categoria.onclick! = function(){ // Le da la funcionalidad

            categoria.classList.toggle(`botonPositivo`); // Alterna el estilo activo

            const nombreCategoriaPresionada:string = categoria.textContent! // Obtiene la categoria presionada
            const urlObjeto = new URL(window.location.href);    // Define el objeto para manejar los query params
            let categoriasActivas = (urlObjeto.searchParams.get('categorias')?urlObjeto.searchParams.get('categorias'):'')! // Obtiene las categorias activas        

            const esActiva = esCategoriaActiva(nombreCategoriaPresionada) // Evalua si la categoria presionada estaba activa
            if(esActiva){ // Si la categoria presionada estaba activa
                categoriasActivas = categoriasActivas.replace(nombreCategoriaPresionada+',','') // La elimina de las categorias activas
            }else{ // Si no estaba activa
                categoriasActivas = categoriasActivas+nombreCategoriaPresionada+',' // La agrega
            }
                
            // Establecer el nuevo valor del parámetro
            urlObjeto.searchParams.set('categorias', categoriasActivas); // Si no existe, lo crea; si existe, lo actualiza
            window.history.pushState({}, '', urlObjeto); // Actualizar la URL sin recargar la página
            
            // Vuelve a cargar los productos con los nuevo query params
            const contenedorProductos: HTMLElement = document.getElementById('contenedorConfiguracionProductos__contenido__productos')!
            buscarProductos(contenedorProductos); // Busca nuevamente los productos en base a los nuevos parametros de busqueda
            
        }
    })

}

const esCategoriaActiva = (categoria:string):boolean=>{
    const params = new URLSearchParams(window.location.search); // Define el objeto para manejar los query params
    let categoriasActivas = params.get('categorias') // Obtiene las categorias activas

    if(categoriasActivas) // Evalua si hay categorias activas
        if(categoriasActivas.includes(categoria)) // Evalua si la categoria presionada estaba activa
            return true 

    // Si no se cumplio alguna de las dos condiciones anteriores devuelve falso
    return false
}