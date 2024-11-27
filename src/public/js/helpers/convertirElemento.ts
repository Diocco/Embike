export const convertirAInput =(botonOrigen:HTMLElement,IdFinal?:string,sessionStorageNombre:string='',tipo:string='text',funcionRecarga?:Function)=>{
    const clasesBotonOrigen = botonOrigen.className
    
    const valor = sessionStorageNombre?sessionStorage.getItem(sessionStorageNombre):botonOrigen.textContent
    if(!IdFinal) IdFinal= new Date().getTime().toString()
    botonOrigen.outerHTML=`<input type="${tipo}" class="inputRegistener1 ${clasesBotonOrigen}" id="${IdFinal}">` // Convierte el boton a un input

    // Busca el nuevo input
    const inputFinal = document.getElementById(IdFinal)! as HTMLInputElement
    inputFinal.value=valor||'' // Le un valor previo o lo deja vacio

    // Añadir un event listener al input
    inputFinal.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // Realiza la búsqueda cuando presionas Enter
            sessionStorage.setItem(sessionStorageNombre,inputFinal.value);
            if(funcionRecarga) funcionRecarga()
            else convertirADIV(inputFinal,IdFinal,sessionStorageNombre,tipo)
        }
    });

    // El input pierde el foco
    inputFinal.addEventListener('blur', () => {
        // Se hace clic fuera del elemento
        sessionStorage.setItem(sessionStorageNombre,inputFinal.value);
        if(funcionRecarga) funcionRecarga()
        else convertirADIV(inputFinal,IdFinal,sessionStorageNombre,tipo)
    });

    return inputFinal
}

const convertirADIV =(inputOrigen:HTMLInputElement,IdFinal?:string,sessionStorageNombre:string='',tipo:string='text',funcionRecarga?:Function)=>{
    const clases = inputOrigen.className.replace('inputRegistener1','')
    const valor = inputOrigen.value
    if(!IdFinal) IdFinal= new Date().getTime().toString()
    inputOrigen.outerHTML=`<div class="${clases}" id="${IdFinal}">${valor}</div>` // Convierte el boton a un input

    // Busca el nuevo div
    const divFinal = document.getElementById(IdFinal)! as HTMLDivElement

    // Añadir un event listener al input
    divFinal.onclick=()=>{
        const elementoFinal = convertirAInput(divFinal,IdFinal,sessionStorageNombre,tipo)
        elementoFinal.focus()
    }



    return divFinal
}