const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Google authentication
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
// Google

const Usuario = require('../models/usuario')
const app = express()

app.post('/login', (req, res) => {

    let body = req.body

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario, o contraseña incorrecto'
                }
            })
        }
        // compara las contraseñas encryptadas
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña, incorrecto'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })

})

// Config de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}
// verify().catch(console.error)

app.post('/google', async(req, res) => {

    let token = req.body.idtoken

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: fasle,
            err: e
        })
    })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {

            if (usuarioDB.email === false) {
                return res.status(403).json({
                    ok: false,
                    err: {
                        message: 'Debe autenticarse con su clave y correo'
                    }
                })
            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            // Si el usuario no existe en bd
            let usuario = new Usuario()

            usuario.nombre = googleUser.name
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = ':)'

            usuario.save((err, usuarioBD) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            })

        }
    })

})

module.exports = app