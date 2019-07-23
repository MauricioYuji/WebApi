let config = require('../../config/config');
let jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js');
const crypto = require('crypto');
const algorithm = 'sha256';
const userController = require('../controllers/user.controller.js');
const baseController = require('../controllers/base.controller');


exports.token = (username) => {
    return token = baseController.generateToken(username);
};
exports.gettoken = (req, res) => {
    var token = baseController.generateToken(req.body.username);
    res.json({
        success: true,
        message: 'Authentication successful!',
        token: token
    });
};
exports.index = (req, res) => {
    res.json({
        success: true,
        message: 'Index page'
    });
};

exports.signinfacebook = (req, res) => {
    console.log("req.body: ", req.body);
    UserModel.find({ email: req.body.email }).then(user => {
        user = user[0];
        console.log("user: ", user);


        var hash = userController.makeid(6);
        var pass = baseController.encrypt(req.body.password, hash);
        const u = new UserModel({
            photoURL: req.body.photoURL,
            fullname: req.body.fullname,
            email: req.body.email,
            password: pass,
            hash_password: hash,
            flagtutorial: false,
            emailconfirm: false,
            isfacebook: req.body.isfacebook
        });

        console.log("LOGIN: ", u);

        userController.createuser(u).then(retorno => {
            baseController.send(res, retorno);
        });

    }).catch(err => {
        console.log("err: ", err);

        res.json({
            success: false,
            message: 'Ocorreu algum erro, por favor tente novamente'
        });
    });

};
exports.loginfacebook = (req, res) => {
    console.log("req.body: ", req.body);
    UserModel.find({ email: req.body.email }).then(user => {
        user = user[0];
        console.log("user: ", user);
        if (user != undefined) {
            var objuser = {
                username: req.body.email,
                password: req.body.password
            };
            login(objuser).then(retorno => {
                baseController.send(res, retorno);
            });
        } else {
            console.log("Usuario não existe");

            var hash = userController.makeid(6);
            var pass = baseController.encrypt(req.body.password, hash);
            const u = new UserModel({
                photoURL: req.body.photoURL,
                fullname: req.body.fullname,
                email: req.body.email,
                password: pass,
                hash_password: hash,
                flagtutorial: false,
                emailconfirm: false,
                isfacebook: req.body.isfacebook
            });

            console.log("LOGIN: ", u);

            userController.createuser(u).then(retorno => {
                baseController.send(res, retorno);
            });
        }
    }).catch(err => {
        console.log("err: ", err);

        res.json({
            success: false,
            message: 'Ocorreu algum erro, por favor tente novamente'
        });
    });

};
async function login(userobj) {
    return UserModel.find({ email: userobj.username }).then(user => {
        var obj = { status: 0, msg: "", data: null, type: 0 };
        if (user.length > 0) {
            user = user[0];
            var pass = baseController.encrypt(userobj.password, user.hash_password);

            if (pass === user.password) {
                if (user.emailconfirm) {
                    obj.status = 200;
                    obj.msg = "Sucesso";
                    obj.data = user;
                    console.log("Sucesso");
                    return obj;
                } else {
                    obj.status = 200;
                    obj.type = 1;
                    obj.msg = "Aguardando confirmação do email, clique aqui para reenviar a confirmação";
                    console.log("Email não confirmado");
                    return obj;
                }
            } else {
                obj.status = 401;
                obj.msg = "Usuário ou senha invalida";
                console.log("senha invalida");
                return obj;
            }
        } else {
            obj.status = 401;
            obj.msg = "Usuário ou senha invalida";
            console.log("usuario invalido");
            return obj;
        }
    }).catch(err => {
        console.log("err: ", err);
        obj.status = 401;
        obj.msg = "Usuário ou senha invalida";
        return obj;
    });
}
exports.login = (req, res) => {

    var objuser = {
        username: req.body.username,
        password: req.body.password
    };


    login(objuser).then(retorno => {
        baseController.send(res, retorno);
    });
};