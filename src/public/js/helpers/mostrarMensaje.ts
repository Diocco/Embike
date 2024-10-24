import { producto } from "../../../models/interfaces/producto.js"
import { urlProductos } from "../registener.js"

export const mostrarMensaje=(codigoMensaje:string="sc",error:boolean=false)=>{
    const contenedorGeneralMensaje:HTMLElement = document.getElementById('contenedorMensajeUsuario')! 
    const contenedorMensaje:HTMLElement = document.getElementById('mensajeUsuario')! 
    const textoMensaje:HTMLElement = document.getElementById('mensajeUsuario__p')!
    const iconoMensaje:HTMLElement = document.getElementById('mensajeUsuario__i')!
    const iconoMensajeError:HTMLElement = document.getElementById('mensajeUsuario__i-error')!

    // Si esta activo, esconde el mensaje
    contenedorGeneralMensaje.classList.remove('contenedorMensajeUsuario-activo') // Reinicia el estado de la animacion
    contenedorMensaje.classList.add('noActivo') // Oculta el mensaje
    contenedorMensaje.classList.remove('mensajeUsuario-animacionSinMensaje'); // Elimina la animacion si existe

    // Definir el icono del mensaje
    if(error){ // Si el mensaje no es un mensaje de error
        iconoMensaje.classList.add('noActivo') // Oculta el icono "chech"
        iconoMensajeError.classList.remove('noActivo') // Muestra el icono "error"
        contenedorMensaje.classList.add('mensajeUsuario-enError') // Cambia el color del fondo
    }

    if(codigoMensaje==='sc'||!codigoMensaje){ // Si no hay ningun mensaje
        // Cambia la animacion
        contenedorMensaje.classList.add('mensajeUsuario-animacionSinMensaje');
    }else{ // Si hay un mensaje entonces lo muestra
        switch (codigoMensaje) {
            case '1':
                textoMensaje.textContent='La sesion ha caducado';
                break;
            case '2':
                textoMensaje.textContent='Error del servidor';
                break;
            case '3':
                textoMensaje.textContent='Error del servidor, vuelva a iniciar sesion';
                break;
            case '4':
                textoMensaje.textContent='Usuario actualizado con exito';
                break;
            case 'sc':
                textoMensaje.textContent='';
                break;
            default: 
                textoMensaje.textContent=`Error desconocido (${codigoMensaje})`;
                break;
        }
    }


    // Muestra el mensaje
    setTimeout(() => { // Se requiere un timeout ya que sino el comportamiento de retirar la clase al principio de la funcion y agregarla al final de la funcion no surten efecto
        contenedorGeneralMensaje.classList.add('contenedorMensajeUsuario-activo') // Activa la animacion
        contenedorMensaje.classList.remove('noActivo') // Muestra el mensaje
    }, 50);
}




//Ventanas emergentes para confirmaciones del usuario o errores
// export function ventanaEmergente(error:(number|string),alternaFondo:Boolean=true):Promise<boolean> {
//     return new Promise((resolve) => {
//         console.log("Se ejecuto");
//         let mensaje:HTMLElement=document.getElementById("ventanaEmergente__contenido__mensaje")!;
//         let fondo:HTMLElement=document.getElementById("ventanaEmergenteFondo")!
//         let botonAceptar:HTMLElement=document.getElementById("ventanaEmergente__contenido__aceptar__boton")!;
//         let botonRechazar:HTMLElement=document.getElementById("ventanaEmergente__contenido__rechazar__boton")!;
//         let ventana:HTMLElement=document.getElementById("ventanaEmergente")!;
//         ventana.classList.toggle("ventanaEmergente-active"); //Muestra la ventana

//         botonAceptar.onclick=()=>{
//             if(alternaFondo){fondo.classList.toggle("ventanaEmergenteFondo-active");} //Alterna el fondo oscuro
//             ventana.classList.toggle("ventanaEmergente-active"); //Esconde la ventana
//             resolve(true);
//         }
//         botonRechazar.onclick=()=>{
//             if(alternaFondo){fondo.classList.toggle("ventanaEmergenteFondo-active");} //Alterna el fondo oscuro
//             ventana.classList.toggle("ventanaEmergente-active"); //Esconde la ventana
//             resolve(false);
//         }

//         if(alternaFondo){fondo.classList.toggle("ventanaEmergenteFondo-active");} //Alterna el fondo oscuro
//         if(typeof error==="string"){mensaje.textContent=error}
//         else{
//             switch (error) { //Se ponen distintos casos de error
//                 case 0:
//                     mensaje.textContent="¿Esta seguro que quiere eliminar este producto?"
//                     break;
//                 default:
//                         mensaje.textContent=`Error desconocido (${error})`; //Si se pasa como argumento un codigo de error no especificado se estipula
//                     break;
//             }
//         }
//     })
// }

// Ventana emergente para modificar o agregar un producto de la base de datos
export function ventanaEmergenteModificarProducto(productoId?:string) {
    // Alterna el color del fondo en los momentos donde hay ventanas emergentes
    const contenedorVentanaEmergente:HTMLElement = document.getElementById('ventanaEmergenteFondo')!
    const ventanaEmergente:HTMLElement = document.getElementById('modificarProducto')!
    contenedorVentanaEmergente.classList.remove('noActivo')
    ventanaEmergente.classList.remove('noActivo')
    

    let aceptar:HTMLElement = document.getElementById("modificarProducto__aceptarRechazar__aceptar")!;
    let rechazar:HTMLElement = document.getElementById("modificarProducto__aceptarRechazar__rechazar")!;
    
    //Selecciona los input en donde el usuario agregara las diferentes caracteristicas del producto
    let nombre = document.getElementById("modificarProducto__caracteristicas__input__nombre")! as HTMLInputElement ;
    let precio = document.getElementById("modificarProducto__caracteristicas__input__precio")! as HTMLInputElement;
    let marca = document.getElementById("modificarProducto__caracteristicas__input__marca")! as HTMLInputElement;
    let modelo = document.getElementById("modificarProducto__caracteristicas__input__modelo")! as HTMLInputElement;
    let imagen = document.getElementById("modificarProducto__fotoDescripcion__img")! as HTMLImageElement;
    let descripcion = document.getElementById("modificarProducto__fotoDescripcion__textarea")! as HTMLTextAreaElement;
    
    //Les da un valor inicial, borrando cualquier valor viejo que tenga
    nombre.value="";
    precio.value="";
    marca.value="";
    modelo.value="";
    imagen.style.backgroundImage=''
    descripcion.textContent=''

    if(!(productoId===undefined)){ // Si a la funcion se le paso un ID de un producto entonces la funcion es para modificarlo un producto
        
        // Busca el producto en la base de datos
        fetch(urlProductos + `/${productoId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json()) // Parsear la respuesta como JSON
        .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            const producto:producto = data // Almacena el producto devuelto por el servidor

            // Coloca la informacion en los inputs correspondientes
            nombre.value = producto.nombre;
            precio.value = `${producto.precio}`;
            marca.value = `${producto.marca}`;
            modelo.value = producto.modelo;
            imagen.style.backgroundImage = `url('${producto.variantes[0].caracteristicas[0].imagenes}')`;
            descripcion.textContent = producto.descripcion;
        }
        })
        .catch(error => { // Si hay un error se manejan 
            mostrarMensaje('2',true);
            console.error(error);
        })

    }   
    // ``return new Promise((resolve) => { //Esperamos la respuesta de los botones aceptar o rechazar

    //     aceptar.onclick=():void=>{ //Si se apreta aceptar...
    //         //Verifica la informacion ingreada por el usuario
    //         let verificado:boolean=false
    //         if(isNaN(Number(precio.value))){ventanaEmergente("El precio ingresado no es valido",false);}
    //         else if(isNaN(Number(stock.value))){ventanaEmergente("El stock ingresado no es valido",false);}
    //         else if(isNaN(Number(codigoBarra.value))){ventanaEmergente("El codigo de barra ingresado no es valido",false);}
    //         else{verificado=true;}

    //         if(verificado){ //Si la informacion ingresada tiene el formato correcto entonces se sigue con la ejecucion...
    //             let productoNuevo:Producto //Aca se va a almacenar el producto nuevo o modificado

    //             if(!(productoId===undefined)){ //Si a la funcion se le paso un ID de un producto entonces la funcion es para modificarlo
    //                 let peticionActualizarProducto: IDBRequest<Producto> = db.transaction([`productos`],`readwrite`).objectStore(`productos`).get(productoId); // Selecciona el almacen de objetos correcto y selecciona el producto a modificar
    //                 peticionActualizarProducto.onsuccess = (event)=>{ //Si se abre correctamente...

    //                     productoNuevo = (event.target as IDBRequest).result; //Selecciona el producto.
    //                     //Remplaza su informacion con la ingresada en los inputs editados por el usuario
    //                     productoNuevo.nombre = nombre.value;
    //                     productoNuevo.precio = Number(precio.value);
    //                     productoNuevo.stock = Number(stock.value);
    //                     productoNuevo.id = id.value; //Hay que verificar que sea unico, y si se cambia hay que eliminar el anterior
    //                     productoNuevo.color = color.value;
    //                     productoNuevo.codigoBarra = Number(codigoBarra.value); //Hay que verificar que que sea unico
    //                     productoNuevo.promocionable = promocionable.value;
    //                     productoNuevo.tipo = tipo.value; //Hay que verificar que haya un tipo igual
    //                     productoNuevo.categoria = categoria.value; //Hay que verificar que haya una categoria igual
    //                     productoNuevo.descripcion = descripcion.value;

    //                     let peticionModificar: IDBRequest = db.transaction([`productos`],`readwrite`).objectStore(`productos`).put(productoNuevo); // Remplaza el producto en la base de datos o lo crea si no existe
    //                     peticionModificar.onsuccess=()=>{
    //                         cargarproductosdb();
    //                         alternarFondoVentanaEmergente();
    //                         resolve(true);
    //                     }
    //                     peticionModificar.onerror=()=>{
    //                         ventanaEmergente("Error al modificar");
    //                     }
    //                 }
    //                 peticionActualizarProducto.onerror=()=>{ //Si no se abre correctamente...
    //                     ventanaEmergente("Error al actualizar producto"); //Le da un error al usuario
    //                 }

    //             }else{ //Si la funcion es para agregar producto entonces...
    //                 productoNuevo={
    //                     foto: ``,
    //                     nombre: `${nombre.value}`,
    //                     id: `${id.value}`,
    //                     precio: Number(precio.value),
    //                     stock: Number(stock.value),
    //                     tipo: `${tipo.value}`,
    //                     categoria: `${categoria.value}`,
    //                     color:color.value,
    //                     codigoBarra: Number(codigoBarra.value),
    //                     promocionable: `${promocionable.value}`,
    //                     descripcion: `${descripcion.value}`,
    //                     orden: 0,
    //                     seleccionado: "true"
    //                 }

    //                 let peticionModificar: IDBRequest = db.transaction([`productos`],`readwrite`).objectStore(`productos`).put(productoNuevo); // Remplaza el producto en la base de datos o lo crea si no existe
    //                 peticionModificar.onsuccess=()=>{
    //                     alternarFondoVentanaEmergente();
    //                     cargarproductosdb();
    //                     resolve(true);
    //                 }
    //                 peticionModificar.onerror=()=>{
    //                     ventanaEmergente("Error al modificar");
    //                 }
                    
    //             }   
    //         }
    //     }
    //     rechazar.onclick=()=>{ //Si se apreta rechazar no se guardan los datos cambiados
    //         alternarFondoVentanaEmergente();
    //         cargarproductosdb();
    //         resolve(false);
    //     }
    // })
}