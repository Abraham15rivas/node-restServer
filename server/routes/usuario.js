const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore')
const Usuario = require('../models/usuario')
const app = express()

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0
    let limite = req.query.limite || 5

    Usuario.find({ status: true }, 'role email nombre status google')
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuario) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ status: true }, (err, total) => {

                res.json({
                    ok: true,
                    total,
                    usuario
                })

            })

        })

})

app.post('/usuario', function(req, res) {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        })

    })

})

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'status'])
    let opts = {
        new: true,
        runValidators: true
    }

    Usuario.findByIdAndUpdate(id, body, opts, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        })
    })

})

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id
    let change = {
        status: false
    }

    // Eliminación lógica
    Usuario.findByIdAndUpdate(id, change, { new: true }, (err, userDelete) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: userDelete
        })

    })

    //Eliminación fisica de la DB
    // Usuario.findByIdAndRemove(id, (err, userDelete) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }
    //     if (!userDelete) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: userDelete
    //     })
    // })
})

module.exports = app