export const convertirAInput =(botonOrigen:HTMLButtonElement,IdFinal:string,sessionStorageNombre:string,funcionRecarga:Function)=>{

    botonOrigen.outerHTML=`<input id="${IdFinal}" class="inputRegistener1">` // Convierte el boton a un input
    const inputFinal = document.getElementById(IdFinal)! as HTMLInputElement // Selecciona el nuevo input
    inputFinal.value=sessionStorage.getItem(sessionStorageNombre)||'' // Le un valor previo o lo deja vacio

    // Añadir un event listener al input
    inputFinal.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // Realiza la búsqueda cuando presionas Enter
            sessionStorage.setItem(sessionStorageNombre,inputFinal.value);
            funcionRecarga()
        }
    });

    // El input pierde el foco
    inputFinal.addEventListener('blur', () => {
        // Se hace clic fuera del elemento
        sessionStorage.setItem(sessionStorageNombre,inputFinal.value);
        funcionRecarga()
    });

    return inputFinal
}