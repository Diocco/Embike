export const formatearImagen64=(imagen64:string)=>{
    let headerImagen = imagen64.substring(0,30) // Obtiene los primeros caracteres de la imagen en formato 64

    // Determina cual es el formato original de la imagen
    let formatoImagen:string = ""
    if (headerImagen.includes("iVBORw0KGgo")) formatoImagen =  "png";
    if (headerImagen.includes("/9j/")) formatoImagen =  "jpeg"; 
    if (headerImagen.includes("R0lGOD")) formatoImagen =  "gif";
    return `data:image/${formatoImagen};base64,${imagen64}`
}