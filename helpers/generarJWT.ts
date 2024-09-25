
import jwt from 'jsonwebtoken'

export const generarJWT = (uid:string) =>{
    return new Promise<string>((resolve, reject) => {
        
        const payload = { uid } // Define que informacion del usuario va a llevar el JWT
        const secretOrPrivateKey = process.env.SECRETORPRIVATEKEY as string // Clave para la encriptacion

        jwt.sign(payload, secretOrPrivateKey, {
            expiresIn: '4h' // Define cuando expira el token
        }, ( err, token ) => { // Callback

            if( err ){ // Si hay un error...
                console.log(err)
                reject('No se pudo generar el token')
            }else{ // Si no hay errores devuelve el token
                resolve(token as string)
            }
        }
    )
})
}

