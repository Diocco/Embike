import { url, urlInicioSesion, urlRegistro } from "./global.js";
import { mostrarMensaje } from "./helpers/mostrarMensaje.js";




document.addEventListener("DOMContentLoaded", function() {

    const esDesarollo:Boolean = window.location.hostname.includes('localhost'); // Revisa el url actual
    const botonRegistrarse:HTMLElement = document.getElementById('inicioSesion__formulario__registrarse')!;
    const volverIniciarSesion:HTMLElement = document.getElementById('volverIniciarSesion')!;
    const formularioRegistrarse:HTMLElement = document.getElementById('registrarse__formulario')!;
    const formularioIniciarSesion:HTMLElement = document.getElementById('inicioSesion__formulario')!;



    // Verifica si hay que mostrar algun mensaje
    const params = new URLSearchParams(window.location.search);
    const codigoMensaje:string|null = params.get('error')
    if(codigoMensaje!==null) mostrarMensaje(codigoMensaje,true);



    // Si se hace click en "Registrarse" se muestra el formulario para registrarse
    botonRegistrarse.addEventListener('click', ()=>{
        formularioRegistrarse.classList.add('registrarse__formulario-active');
        formularioIniciarSesion.classList.remove('inicioSesion__formulario-active');
    })

    // Si se hace click en "Iniciar sesion" se muestra el formulario para iniciar sesion
    volverIniciarSesion.addEventListener('click', ()=>{
        formularioRegistrarse.classList.remove('registrarse__formulario-active');
        formularioIniciarSesion.classList.add('inicioSesion__formulario-active');
    })



    // Ventana de inicio de sesion
    const emailInput:HTMLInputElement = document.getElementById('inicioSesion__formulario__ingresarCorreo')! as HTMLInputElement;
    const mensajeErrorEmail: HTMLElement = document.getElementById('errorEmail')!;
    const passwordInput:HTMLInputElement = document.getElementById('inicioSesion__formulario__ingresarPassword')! as HTMLInputElement;
    const mensajeErrorPassword: HTMLElement = document.getElementById('errorPassword')!;
    const botonEnviar: HTMLElement = document.getElementById('inicioSesion__formulario__enviar')!;

    formularioIniciarSesion.addEventListener('submit',(event)=>{
        event.preventDefault(); // Evita que el formulario recargue la página

        botonEnviar.classList.add('boton__enProceso') // Modifica el estilo del boton para aclarar que se esta procesando la solicitud

        // Elimina, si esta presente, los estados de error
        emailInput.classList.remove('boton__enError')
        passwordInput.classList.remove('boton__enError')
        mensajeErrorEmail.textContent=''
        mensajeErrorPassword.textContent=''

        const data={ // Define los parametros inputs por el usuario para enviarlos al servidor
            correo:emailInput.value,
            password:passwordInput.value
        }
        
        fetch(urlInicioSesion, { // Realiza el post
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // Convertir los datos a JSON
        })

        .then(response => response.json()) // Parsear la respuesta como JSON
        .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
            if(data.errors){ // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
                mostrarMensaje('',true);
                (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                    if(error.path==='correo'){ // Si el error es del correo:
                        emailInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo
                        if(!mensajeErrorEmail.textContent){ // Verifica si tenia un mensaje de error previo
                            mensajeErrorEmail.textContent=error.msg; // Si no tenia, le coloca 
                        }
                    }else{ // Si el error no es del correo, entonces deberia ser de la password
                        passwordInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo 
                        if(!mensajeErrorPassword.textContent){ // Verifica si tenia un mensaje de error previo
                            mensajeErrorPassword.textContent=error.msg; // Si no tenia, le coloca 
                        }
                    }
                })
            }else{ // Si el servidor devuelve un inicio de sesion exitoso:
                const tokenAcceso = data.token; // Define el token de acceso devuelto por el servidor
                localStorage.setItem('tokenAcceso',tokenAcceso); // Guarda el token en el navegador del usuario para usarlo cuando se requiera
                window.location.assign(url) // Redirije al usuario al inicio de la pagina
            }
        })
        .catch(error => { // Si hay un error se manejan 
            mostrarMensaje('2',true);
            console.error(error);
        })
        .finally(()=>{
            botonEnviar.classList.remove('boton__enProceso') // Modifica el estilo del boton para aclarar que la solicitud termino
        });
        
    })

    // Si se hace click en email y estaba marcado como con un error, lo remueve
    emailInput.addEventListener('click', () =>{ 
        emailInput.classList.remove('boton__enError')
        mensajeErrorEmail.textContent=null;
    })

    // Si se hace click en password y estaba marcado como con un error, lo remueve
    passwordInput.addEventListener('click', () =>{ 
        passwordInput.classList.remove('boton__enError')
        mensajeErrorPassword.textContent=null;
    })









    // Ventana de registrarse
    const nombreInput:HTMLInputElement = document.getElementById('registrarse__formulario__ingresarNombre')! as HTMLInputElement;
    const mensajeErrorNombre:HTMLElement = document.getElementById('errorNombreRegistro')!;
    const registroEmailInput:HTMLInputElement = document.getElementById('registrarse__formulario__ingresarCorreo')! as HTMLInputElement;
    const mensajeErrorEmailRegistro:HTMLElement = document.getElementById('errorEmailRegistro')!;
    const registroPasswordInput:HTMLInputElement = document.getElementById('registrarse__formulario__ingresarPassword')! as HTMLInputElement;
    const mensajeErrorPasswordRegistro:HTMLElement = document.getElementById('errorPasswordRegistro')!;
    const registroPasswordRepetirInput:HTMLInputElement = document.getElementById('registrarse__formulario__repetirPassword')! as HTMLInputElement;
    const mensajeErrorPasswordRepetirRegistro:HTMLElement = document.getElementById('errorRepetirPasswordRegistro')!;
    const botonEnviarRegistro:HTMLElement = document.getElementById('registrarse__formulario__enviar')!;

    formularioRegistrarse.addEventListener('submit',(event)=>{
        event.preventDefault(); // Evita que el formulario recargue la página

        botonEnviarRegistro.classList.add('boton__enProceso') // Modifica el estilo del boton para aclarar que se esta procesando la solicitud

        // Elimina, si esta presente, los estados de error
        nombreInput.classList.remove('boton__enError')
        registroPasswordRepetirInput.classList.remove('boton__enError')
        registroPasswordInput.classList.remove('boton__enError')
        registroEmailInput.classList.remove('boton__enError')
        mensajeErrorNombre.textContent=''
        mensajeErrorEmailRegistro.textContent=''
        mensajeErrorPasswordRegistro.textContent=''
        mensajeErrorPasswordRepetirRegistro.textContent=''

        // Compara si las contraseñas introducidas son iguales
        if(registroPasswordInput.value&&registroPasswordRepetirInput.value){ // Primero verifica que ambas no sean nulas
            if(!(registroPasswordInput.value===registroPasswordRepetirInput.value)){ // Luego verifican que sean iguales, y si no lo son:

                registroPasswordRepetirInput.classList.add('boton__enError')
                mensajeErrorPasswordRepetirRegistro.textContent='Las contraseñas introducidas no coinciden'
                mostrarMensaje('',true);
            }else{ // Si las contraseñas son iguales entonces se realiza la peticion POST


                const data={ // Define los parametros inputs por el usuario para enviarlos al servidor
                    nombre:nombreInput.value,
                    password:registroPasswordInput.value,
                    correo:registroEmailInput.value,
                    rol:'usuario',
                    activo:'true',
                    google:'false'
                }
                fetch(urlRegistro, { // Realiza el post
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data) // Convertir los datos a JSON
                })
                .then(response => response.json()) // Parsear la respuesta como JSON
                .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
                    mostrarMensaje('',true);
                    if(data.errors){ // Si el servidor devuelve errores en el inicio de sesion los muestra segun corresponda
                        (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores

                            if(error.path==='correo'){ // Si el error es del correo:

                                registroEmailInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo
                                if(!mensajeErrorEmailRegistro.textContent){ // Verifica si tenia un mensaje de error previo
                                    mensajeErrorEmailRegistro.textContent=error.msg; // Si no tenia, le coloca 
                                }

                            }else if(error.path==='nombre'){
                                
                                nombreInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo
                                if(!mensajeErrorNombre.textContent){ // Verifica si tenia un mensaje de error previo
                                    mensajeErrorNombre.textContent=error.msg; // Si no tenia, le coloca 
                                }

                            }else{ // Si el error no es del nombre, entonces deberia ser de la password
                                registroPasswordInput.classList.add('boton__enError'); // Cambia el borde del input del correo a rojo 
                                if(!mensajeErrorPasswordRegistro.textContent){ // Verifica si tenia un mensaje de error previo
                                    mensajeErrorPasswordRegistro.textContent=error.msg; // Si no tenia, le coloca 
                                }
                            }
                        })
                    }else{ // Si el servidor devuelve un registro exitoso:

                        const tokenAcceso = data.token; // Define el token de acceso devuelto por el servidor
                        localStorage.setItem('tokenAcceso',tokenAcceso); // Guarda el token en el navegador del usuario para usarlo cuando se requiera
                        window.location.assign(url) // Redirije al usuario al inicio de la pagina
                        
                    }
                })
                .catch(error => { // Si hay un error se manejan 
                    mostrarMensaje('2',true);
                    console.error(error);
                })
                .finally( ()=>{
                    botonEnviarRegistro.classList.remove('boton__enProceso') // Modifica el estilo del boton para aclarar que la solicitud termino
                });;
            }
        }

    })
    
    // Si se hace click en el nombre y estaba marcado como con un error, lo remueve
    nombreInput.addEventListener('click', (event) =>{ 
        nombreInput.classList.remove('boton__enError')
        mensajeErrorNombre.textContent=null;
    })

    // Si se hace click en email y estaba marcado como con un error, lo remueve
    registroEmailInput.addEventListener('click', (event) =>{ 
        registroEmailInput.classList.remove('boton__enError')
        mensajeErrorEmailRegistro.textContent=null;
    })

    // Si se hace click en password y estaba marcado como con un error, lo remueve
    registroPasswordInput.addEventListener('click', (event) =>{ 
        registroPasswordInput.classList.remove('boton__enError')
        mensajeErrorPasswordRegistro.textContent=null;
    })

    // Si se hace click en password y estaba marcado como con un error, lo remueve
    registroPasswordRepetirInput.addEventListener('click', (event) =>{ 
        registroPasswordRepetirInput.classList.remove('boton__enError')
        mensajeErrorPasswordRepetirRegistro.textContent=null;
    })

})