const selectorTema = document.getElementById('configuracion__global__select-tema')! as HTMLSelectElement
selectorTema.addEventListener('change',()=>{
    const temaSeleccionado = selectorTema.value

    switch (temaSeleccionado) {
        case 'Oscuro':
            
            document.documentElement.style.setProperty('--colorFondo', 'rgba(40, 40, 40)');
            document.documentElement.style.setProperty('--colorBarraLateral', 'rgba(50, 50, 50)');

            document.documentElement.style.setProperty('--colorFondoVentana', 'rgba(70, 70, 70)');
            document.documentElement.style.setProperty('--colorVentana', 'rgba(80, 80, 80)');

            document.documentElement.style.setProperty('--colorBotones', 'rgba(100, 100, 100)');

            break;
        case 'Azul oscuro':
            
            document.documentElement.style.setProperty('--colorFondo', '#2b1d4d');
            document.documentElement.style.setProperty('--colorBarraLateral', '#3B2869');

            document.documentElement.style.setProperty('--colorFondoVentana', '#453576');
            document.documentElement.style.setProperty('--colorVentana', '#4F4698');

            document.documentElement.style.setProperty('--colorBotones', '#3B82C4');

            break;
        case 'Rojo chino':
            
            document.documentElement.style.setProperty('--colorFondo', '#070709');
            document.documentElement.style.setProperty('--colorBarraLateral', '#4b2d2e');

            document.documentElement.style.setProperty('--colorFondoVentana', '#824334');
            document.documentElement.style.setProperty('--colorVentana', '#f42c1d');

            document.documentElement.style.setProperty('--colorBotones', '#AE1918');

            break;
    }
})