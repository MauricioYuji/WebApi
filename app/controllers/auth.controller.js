const UserModel = require('../models/user.model.js');
const userController = require('../controllers/user.controller.js');
const emailController = require('../controllers/email.controller.js');
const baseController = require('../controllers/base.controller');
const obj = { status: 0, msg: "", data: null, type: 0 };

//exports.token = (username) => {
//    return token = baseController.generateToken(username);
//};

async function login(res, userobj) {
    return UserModel.find({ email: userobj.username }).then(user => {
        if (user.length > 0) {
            user = user[0];
            var pass = baseController.encrypt(userobj.password, user.hash_password);

            userobj = {
                photo: user.photoURL,
                email: user.email,
                name: user.fullname,
                id: user._id,
                flagtutorial: user.flagtutorial,
                emailconfirm: user.emailconfirm
            };
            var token = baseController.generateToken(user.email);

            if (pass === user.password) {
                if (user.emailconfirm) {
                    obj.status = 200;
                    obj.msg = "Sucesso";
                    obj.data = userobj;
                    obj.token = token;
                } else {
                    obj.status = 200;
                    obj.type = 1;
                    obj.msg = "Aguardando confirmação do email, clique aqui para reenviar a confirmação.";
                }
            } else {
                obj.status = 401;
                obj.msg = "Usuário ou senha invalida.";
            }
        } else {
            obj.status = 401;
            obj.msg = "Usuário ou senha invalida.";
        }
        baseController.send(res, obj);
    }).catch(err => {
        console.log("err: ", err);
        obj.status = 401;
        obj.msg = "Usuário ou senha invalida.";
        baseController.send(res, obj);
    });
}
exports.gettoken = (req, res) => {
    var token = baseController.generateToken(req.body.username);
    res.json({
        success: true,
        message: 'Login realizado com sucesso.',
        token: token
    });
};
exports.getuserrequest = (req, res) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token != undefined) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        userid = token.split("/")[0];
    }
    return userid;
};
exports.signinfacebook = (req, res) => {
    UserModel.find({ email: req.body.email }).then(user => {
        user = user[0];


        var hash = baseController.makeid(6);
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

        userController.createuser(res, u);

    }).catch(err => {
        console.log("err: ", err);

        res.json({
            success: false,
            message: 'Ocorreu algum erro, por favor tente novamente.'
        });
    });

};
exports.loginfacebook = (req, res) => {
    UserModel.find({ email: req.body.email }).then(user => {
        user = user[0];
        if (user != undefined) {
            var objuser = {
                username: req.body.email,
                password: req.body.password
            };
            login(res, objuser);
        } else {

            var hash = baseController.makeid(6);
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

            userController.createuser(res, u);
        }
    }).catch(err => {
        console.log("err: ", err);

        res.json({
            success: false,
            message: 'Ocorreu algum erro, por favor tente novamente.'
        });
    });

};
exports.login = (req, res) => {

    var objuser = {
        username: req.body.username,
        password: req.body.password
    };


    login(res, objuser);
};
exports.sendconfirm = (req, res) => {
    UserModel.find({ email: req.body.email }).then(u => {
        if (u.length > 0) {
            var user = u[0];
            var token = baseController.encrypt(user.id, user.hash_password);
            var html = '<a href="http://192.168.15.12:3000/confirm/' + user.id + '-' + token + '">Clique aqui para confirmar sua conta</a>';
            emailController.send(user.email, html, "Confirmação de conta");
            obj.status = 200;
            obj.msg = "Confirmação enviada com sucesso, verifique seu email.";
        } else {
            obj.status = 401;
            obj.msg = "Email não cadastrado, tente outro.";
        }
        baseController.send(res, obj);

    }).catch(err => {
        if (err.kind === 'ObjectId') {
            obj.status = 404;
            obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente.";
        } else {
            obj.status = 500;
            obj.msg = "Houve um erro, tente novamente.";
        }
        baseController.send(res, obj);
    });

};
exports.resetpassword = (req, res) => {
    UserModel.find({ email: req.body.email }).then(u => {
        if (u.length > 0) {
            var user = u[0];
            if (!user.isfacebook) {
                var token = baseController.encrypt(user.id + user.password, user.hash_password);
                var html = '<a href="http://192.168.15.12:3000/changepassword/?token=' + user.id + "-" + token + '">Clique aqui para definir sua nova senha</a>';
                emailController.send(user.email, html, "Reset de senha");
                obj.status = 200;
                obj.msg = "Confira seu email para trocar a senha.";
            } else {
                obj.status = 401;
                obj.msg = "Este email está cadastrado via facebook, para logar basta clicar em \"Entrar com o facebook\" e logar na sua conta do facebook.";
            }
        } else {
            obj.status = 401;
            obj.msg = "Email não cadastrado, tente outro.";
        }
        baseController.send(res, obj);

    }).catch(err => {
        if (err.kind === 'ObjectId') {
            obj.status = 404;
            obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente.";
        } else {
            obj.status = 500;
            obj.msg = "Houve um erro, tente novamente.";
        }
        baseController.send(res, obj);
    });

};
exports.changepassword = (req, res) => {
    obj.status = 200;
    obj.msg = "Digite a nova senha.";
    obj.data = "changepassword.html";
    baseController.sendfile(res, obj);
};
exports.sendpassword = (req, res) => {
    var id = req.body.token.split("-")[0];
    var token = req.body.token.split("-")[1];

    UserModel.findById(id).then(user => {

        var checktoken = baseController.encrypt(user.id + user.password, user.hash_password);
        if (token == checktoken) {
            var password = baseController.encrypt(req.body.password, user.hash_password);
            UserModel.findByIdAndUpdate(id, {
                password: password
            }, { new: true }).then(user => {
                if (!user) {
                    obj.status = 401;
                    obj.msg = "Email inválido.";
                } else {
                    obj.status = 200;
                    obj.msg = "Senha alterada com sucesso.";
                }
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    obj.status = 404;
                    obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente.";
                } else {
                    obj.status = 500;
                    obj.msg = "Houve um erro, tente novamente.";
                }
                baseController.send(res, obj);
            });
        } else {
            obj.status = 401;
            obj.msg = "Token invalido.";
        }
        baseController.send(res, obj);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            obj.status = 404;
            obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente";
        } else {
            obj.status = 500;
            obj.msg = "Houve um erro, tente novamente";
        }
        baseController.send(res, obj);
    });
};
exports.confirm = (req, res) => {
    var data = req.params.token.split("-");
    var id = data[0];
    var token = data[1];

    UserModel.findById(id)
        .then(user => {
            if (!user) {
                obj.status = 404;
                obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente.";
                baseController.sendfile(res, obj);
            } else {
                var checktoken = baseController.encrypt(id, user.hash_password);
                if (checktoken == token) {
                    UserModel.findByIdAndUpdate(id, {
                        emailconfirm: true
                    }, { new: true })
                        .then(user => {
                            if (!user) {
                                obj.status = 404;
                                obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente.";
                            } else {
                                obj.status = 200;
                                obj.msg = "Confirmado com sucesso.";
                                obj.data = "success.html";
                            }
                            baseController.sendfile(res, obj);
                        }).catch(err => {
                            if (err.kind === 'ObjectId') {
                                obj.status = 404;
                                obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente.";
                            } else {
                                obj.status = 500;
                                obj.msg = "Houve um erro, tente novamente.";
                            }
                            baseController.sendfile(res, obj);
                        });
                } else {
                    obj.status = 404;
                    obj.msg = "Token invalido.";
                    baseController.sendfile(res, obj);
                }
            }


        }).catch(err => {
            if (err.kind === 'ObjectId') {
                obj.status = 404;
                obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente";
            } else {
                obj.status = 500;
                obj.msg = "Houve um erro, tente novamente";
            }
            baseController.sendfile(res, obj);
        });


};
