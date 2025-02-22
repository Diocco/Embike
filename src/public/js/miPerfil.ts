import { usuario } from "../../models/interfaces/usuario.js";
import { tokenAcceso } from "./global.js";
import {url,usuarioVerificado} from "./header.js";
import { mostrarMensaje } from "./helpers/mostrarMensaje.js";
import { solicitudActualizarUsuario } from "./services/usuariosAPI.js";


// Inputs con la informacion del usuario 
const imgInput:HTMLInputElement = document.getElementById('form__div-fotoPerfil__input-subirFoto')! as HTMLInputElement;
const nombreInput:HTMLInputElement = document.getElementById('form__input-nombre')! as HTMLInputElement;
const correoInput:HTMLInputElement = document.getElementById('form__input-correo')! as HTMLInputElement;
const passwordInput:HTMLInputElement = document.getElementById('form__input-nuevaContraseña')! as HTMLInputElement;
const passwordRepetirInput:HTMLInputElement = document.getElementById('form__input-repetirContraseña')! as HTMLInputElement;
const telefonoInput:HTMLInputElement = document.getElementById('form__input-telefono')! as HTMLInputElement;
const codPostalInput:HTMLInputElement = document.getElementById('form__input-codigoPostal')! as HTMLInputElement;
const provinciaInput:HTMLInputElement = document.getElementById('form__input-provincia')! as HTMLInputElement;
const ciudadInput:HTMLInputElement = document.getElementById('form__input-ciudad')! as HTMLInputElement;
const calleInput:HTMLInputElement = document.getElementById('form__input-calleNumero')! as HTMLInputElement;
const pisoInput:HTMLInputElement = document.getElementById('form__input-pisoDepto')! as HTMLInputElement;
const observacionInput:HTMLInputElement = document.getElementById('form__input-observacion')! as HTMLInputElement;

// Formulario y envio de formulario
const enviarFormulario:HTMLElement = document.getElementById('form__button-enviarFormulario')! as HTMLButtonElement;


const actualizarUsuario = async(datosFormulario:FormData)=>{

    const respuesta = await solicitudActualizarUsuario(datosFormulario)
    if(respuesta.errors){ // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
        mostrarMensaje('',true);
        (respuesta.errors).forEach(error => { // Recorre los errores
            let inputEnError:HTMLInputElement|undefined // Variable que almacena el input que esta en estado de error
            // Define el input en error mediante el "path" del error
            if(error.path==='correo') inputEnError=correoInput 
            else if(error.path==='nombre')inputEnError=correoInput
            else if(error.path==='telefono')inputEnError=correoInput
            else if(error.path==='archivo')inputEnError=imgInput
            else if(error.path==='password')inputEnError=passwordInput

            if(inputEnError){ // Define el estilo del input en error
                inputEnError.classList.add('boton__enError');
                const errorTexto=inputEnError.nextElementSibling;
                if(errorTexto) errorTexto.textContent=error.msg;
            }
        })
    }else mostrarMensaje('4');// Si el servidor devuelve un  exitoso:

    enviarFormulario.classList.remove('form__button-enviarFormulario-enProceso') // Modifica el estilo del boton para aclarar que la solicitud termino
}

const mostrarInformacionUsuario =(usuario:usuario)=>{
    // Coloca la informacion del usuario en los inputs correspondientes

    // Foto de perfil
    const fotoUsuario = document.getElementById('form__div-fotoPerfil__div-foto')! as HTMLDivElement
    if(usuario.img){ // Si el usuario tiene foto de perfil entonces la coloca
        fotoUsuario.style.backgroundImage=`url(../img/fotosPerfil/${usuario.img})`
    }else{// Si el usuario no tiene foto entonces pone como imagen su inicial de nombre o sus dos primeras iniciales
        const nombres:string[] = (usuario.nombre as string).split(' '); // Divide el nombre de usuario por la cantidad de espacios que tiene
        if(nombres.length > 1){ // Si el usuario tiene mas de un espacio entonces coloca la primer letra de las primeros dos palabras del nombre
            fotoUsuario.textContent = nombres[0][0].toUpperCase() + nombres[1][0].toUpperCase()
        }else{ 
            // Si solo tiene una palabra como nombre, muestra las primeras dos letras de esa palabra
            fotoUsuario.textContent = nombres[0].slice(0, 2).toUpperCase()      
        }
    }

    // Obtener los elementos de los inputs y asignar sus valores
    const nombreInput = document.getElementById('form__input-nombre') as HTMLInputElement;
    const correoInput = document.getElementById('form__input-correo') as HTMLInputElement;
    const telefonoInput = document.getElementById('form__input-telefono') as HTMLInputElement;

    if (nombreInput) nombreInput.value = usuario.nombre;
    if (correoInput) correoInput.value = usuario.correo;
    if (usuario.telefono) if (telefonoInput) telefonoInput.value = (usuario.telefono).substring(3);
    
    if(usuario.direccion){ // Verifica si existe la informacion de la direccion de usuario
        // Informacion de la direccion del usuario
        if (usuario.direccion.codPostal) codPostalInput.value = usuario.direccion.codPostal;
        if (usuario.direccion.provincia) provinciaInput.value = usuario.direccion.provincia;
        if (usuario.direccion.ciudad) ciudadInput.value = usuario.direccion.ciudad;
        if (usuario.direccion.calle) calleInput.value = usuario.direccion.calle;
        if (usuario.direccion.piso) pisoInput.value = usuario.direccion.piso;
        if (usuario.direccion.observacion) observacionInput.value = usuario.direccion.observacion;
    }
}

const informacionFormulario=(usuario:usuario)=>{

    return new Promise<FormData>((resolve, reject) => {
        // Formulario
        const formulario = document.getElementById('contenedorInformacion__form')! as HTMLFormElement; 

        // Modifica el estilo del boton para aclarar que se esta procesando la solicitud
        enviarFormulario.classList.add('form__button-enviarFormulario-enProceso') 

        // Elimina, si esta presente, los estados de error
        document.querySelectorAll(".form__input-enError")?.forEach((input)=>input.classList.remove('form__input-enError'))
        document.querySelectorAll(".form__error")?.forEach((textoError)=>textoError.textContent='')

        
        // Compara si las contraseñas introducidas son iguales
        if(!(passwordInput.value===passwordRepetirInput.value)){ 
            const mensajeErrorPasswordRepetir:HTMLElement = document.getElementById('form__a-repetirContraseña')! as HTMLParagraphElement;
            passwordRepetirInput.classList.add('form__input-enError')
            mensajeErrorPasswordRepetir.textContent='Las contraseñas introducidas no coinciden'
            reject()
        }
        
        const datosFormulario = new FormData(formulario); // Captura todos los campos del formulario
        
        
        // Elimina de los datos del formulario los inputs vacios o que no fueron modificados

        // Imagen: Si el input esta vacio no lo envia
        if(!(imgInput.files![0]))datosFormulario.delete('img')
        
        // Nombre: Si el input esta vacio o tiene el mismo valor que el almacenado en la base de datos entonces no lo envia
        if(nombreInput.value===''||nombreInput.value===usuario.nombre)datosFormulario.delete('nombre')
        
        // Correo: Si el input esta vacio o tiene el mismo valor que el almacenado en la base de datos entonces no lo envia
        if(correoInput.value===''||correoInput.value===usuario.correo)datosFormulario.delete('correo')
        
        // Password: Si el input esta vacio o tiene el mismo valor que el almacenado en la base de datos entonces no lo envia
        if(passwordInput.value===''||passwordInput.value===usuario.password)datosFormulario.delete('password')
        
        // Telefono: Si el input esta vacio o tiene el mismo valor que el almacenado en la base de datos entonces no lo envia
        if(telefonoInput.value===''||telefonoInput.value===usuario.telefono)datosFormulario.delete('telefono')
        else datosFormulario.set('telefono','549' + datosFormulario.get('telefono'))// Le da un formato correcto al telefono
        
        // Password: Si el input esta vacio o tiene el mismo valor que el almacenado en la base de datos entonces no lo envia
        if(passwordInput.value===''||passwordInput.value===usuario.password)datosFormulario.delete('password')
        
        resolve(datosFormulario)
    })
}

document.addEventListener('DOMContentLoaded',async()=>{
    // Escucha cuando se envia el formulario
    document.getElementById('contenedorInformacion__form')!.addEventListener('submit',async(event)=>{
        event.preventDefault(); // Evita que el formulario recargue la página
        const datosFormulario = await informacionFormulario(usuario) // Recupera la informacion colocada por el usuario en los inputs
        actualizarUsuario(datosFormulario) // Enviar la informacion al servidor
    })

    // Espera la solicitud del servidor realizada en el header para obtener la informacion del usuario
    const usuario = (await usuarioVerificado)!   

    // Muestra la informacion del usuario en los inputs
    mostrarInformacionUsuario(usuario)

    // Escucha si el usuario sube una imagen y la muestra
    const cargarImagenInput = document.getElementById('form__div-fotoPerfil__input-subirFoto')! as HTMLInputElement;
    const contenedorImagen = document.getElementById('form__div-fotoPerfil__div-foto')! as HTMLDivElement;
    cargarImagenInput.addEventListener('change', () => {
        if(cargarImagenInput.files){ // Si hay un archivo cargado 
            const imagen = cargarImagenInput.files[0]; // Obtener el primer archivo

            const reader = new FileReader(); // Crear un objeto FileReader

            reader.onload = (e) => {
                contenedorImagen.textContent='' // Vacia el contenedor
                contenedorImagen.style.backgroundImage = `url(${e.target!.result})`; // Establece la imagen como fondo del div
            };
    
            reader.readAsDataURL(imagen); // Leer el archivo como URL de datos
        }
    })

})
