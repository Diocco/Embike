import { usuario } from "../../models/interfaces/usuario.js";
import { mostrarMensaje } from "./helpers/mostrarMensaje.js";

// Define el entorno
export let url:string
export const esDesarollo:Boolean = window.location.hostname.includes('localhost'); // Revisa el url actual

if(esDesarollo){ // Si incluye localhost entonces estas en desarrollo, por lo que define el url para la peticion
    url = 'http://localhost:8080';
}else{ // Si no tiene localhost define el url en la pagina web para la peticion
    url= 'https://embike-223a165b4ff6.herokuapp.com';
}

// Define los url del REST server
export const urlProductos:string = url + '/api/productos'
export const urlCategorias:string = url + '/api/categorias'
export const urlInicioSesion:string = url + '/api/auth/login'
export const urlRegistro:string = url + '/api/usuarios'
export const urlVariantes:string = url + '/api/variantes'



// Informacion del usuario
export let usuarioVerificado: Promise<usuario | undefined>
export const tokenAcceso: string | null = localStorage.getItem('tokenAcceso') // Recupera el token de acceso desde el localStorage

if(tokenAcceso){ // Si el token existe entonces quiere decir que el usuario tiene una sesion activa

    usuarioVerificado = fetch(url+'/api/usuarios/token', {  // Solicita la informacion del usuario
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'tokenAcceso':`${tokenAcceso}`},
    })
    .then(response => response.json())
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error.msg)})
                // Borra el token con problemas
                localStorage.removeItem('tokenAcceso') // Elimina el token de acceso
                window.location.assign(url+'/inicioSesion?error=1') // Redirije al usuario al inicio de sesion
                return undefined
        }else{
            const usuarioVerificado:usuario = data.usuarioVerificado
            return usuarioVerificado
        };
    })
    .catch(error =>{
        // Borra el token con problemas
        localStorage.removeItem('tokenAcceso') // Elimina el token de acceso
        mostrarMensaje('3',true)
        console.error(error)
        setTimeout(() => {
            window.location.assign(url+'/inicioSesion') // Redirije al usuario al inicio de sesion
        }, 6000);
        return undefined
    }) 
}


