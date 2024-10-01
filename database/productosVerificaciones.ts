import Producto from "../src/models/productos";

// Verifica que el producto exista
const productoExiste = async(id:string) =>{

        const productoDB = await Producto.findById(id) // Verifica si en la base de datos haya un objeto que tenga el id pasado como argumento
        if(!productoDB){ // Si el producto no existe entonces:
            throw new Error(`El producto con id: ${id}, no existe`);
        }else if(!productoDB.estado){ // Si el producto existe pero no tiene estado activo entonces:
            throw new Error(`El producto con id: ${id}, no esta activado`);
        }
}

// Verifica que el SKU sea unico 
const SKUUnico = async(SKU:String) =>{

    if(!(SKU==="0")){ // Si el SKU es "0" entonces no realiza la verificacion
        const existe = await Producto.findOne({SKU}) // Verifica si en la base de datos haya un objeto que tenga una SKU "parametro" con el mismo valor pasado como argumento en el body
        if(existe){ // Si el SKU es encontrado entonces:
            throw new Error(`El SKU ingresado ya esta registrado`);
        };
    }
}

export{
    productoExiste,
    SKUUnico
}