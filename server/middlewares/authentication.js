const jwt = require('jsonwebtoken')

let verificarToken = (req, res, next) => {

    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        res.usuario = decoded.usuario
        next()
    })
}

let verificarRole = (req, res, next) => {

    let usuario = res.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no administrador'
            }
        })
    }
}

module.exports = {
    verificarToken,
    verificarRole
}