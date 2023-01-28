import express from 'express';
import {client, EventEmitter} from "../app";

const userController = express.Router();
userController.get('/', (req, res) => {
    res.status(200).json({
        status: 'success'
    });
});
userController.get('/RegisterNewUser/:username/:fullName', (req, res) => {
    let secret = req.params.username + ":" + "QWERT@1234";
    let genId = Math.floor(Math.random() * 90000) + 10000;

    let data = {
        acc: {
            id: genId.toString(),
            cred: [{meth: "email", val: "info@unify.com"}],
            secret: Buffer.from(secret).toString('base64'),
            desc: {public: {fn: req.params.fullName}},
            login: true,
            scheme: "basic",
            user: "new"
        }
    }

    client.send(JSON.stringify(data));
    EventEmitter.on("ctrl", (result) => {
        if (result.id == genId) {
            if (result.text && result.text == 'ok') {
                res.status(200).json({
                    data: true,
                    param: result.params,
                    status: 'Register succeed'
                });
            } else {
                res.status(200).json({
                    data: false,
                    status: result.text,
                });
            }
        }
    })

});

userController.get('/LoginUser/:username', (req, res) => {
    let secret = req.params.username + ":" + "QWERT@1234";
    let genId = Math.floor(Math.random() * 90000) + 10000;
    let data = {
        login: {
            id: genId.toString(),
            secret: Buffer.from(secret).toString('base64'),
            scheme: "basic",
        }
    }
    client.send(JSON.stringify(data));
    EventEmitter.on("ctrl", (result) => {
        if (result.id == genId) {
            if (result.text && result.text == 'ok') {
                res.status(200).json({
                    data: true,
                    param: result.params,
                    status: 'Login succeed'
                });
            } else {
                res.status(200).json({
                    data: false,
                    status: result.text,
                });
            }
        }
    })
});
export default userController;