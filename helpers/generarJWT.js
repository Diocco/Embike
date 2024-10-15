import jwt from 'jsonwebtoken';
export const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid }; // Define que informacion del usuario va a llevar el JWT
        const secretOrPrivateKey = process.env.SECRETORPRIVATEKEY; // Clave para la encriptacion
        jwt.sign(payload, secretOrPrivateKey, {
            expiresIn: '4h' // Define cuando expira el token
        }, (err, token) => {
            if (err) { // Si hay un error...
                console.log(err);
                reject('No se pudo generar el token');
            }
            else { // Si no hay errores devuelve el token
                resolve(token);
            }
        });
    });
};
