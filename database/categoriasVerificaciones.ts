import Categoria from "../src/models/categoria";

// Verifica si la categoria existe mediante su id
const categoriaExiste = async(id:string) =>{
    try {
        const existe = await Categoria.findById(id) // Verifica si en la base de datos haya un objeto que tenga el id pasado como argumento
        if(!existe){ // Si la categoria no existe entonces:
            throw new Error(`La categoria con id: ${id}, no existe`);
        };
    } catch (error) { // Si el id no es valido entonces:
        throw new Error(`El id: ${id}, no es valido`);
    }
}


export{
    categoriaExiste
}