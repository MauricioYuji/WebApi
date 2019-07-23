const UserModel = require('../models/user.model.js');
// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'sha256';
const email = require('../controllers/email.controller.js');

const authController = require('../controllers/auth.controller.js');
const baseController = require('../controllers/base.controller.js');

function encrypt(password, secret) {
    const hash = crypto.createHmac(algorithm, secret)
        .update(password)
        .digest('hex');
    return hash;
}
function makeid(length) {

    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.makeid = (length) => {
    return makeid(length);
};

exports.findAll = (req, res) => {
    var perpage = 10;
    var s = req.query.s;

    var search = {};
    var regexS = new RegExp('^.*' + s + '', 'i');
    if (s != undefined) {
        search = { name: regexS };
    }

    var query = UserModel.find(search);
    query.limit(perpage).skip((req.query.page - 1) * perpage)
        .then(user => {
            UserModel.countDocuments(search, function (err, count) {
                console.log("Number of users:", count);
                var json = { "List": user, "Total": count };
                res.send(json);
            })
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    console.log("GET USER: ", req.headers.token);
    var obj = { status: 0, msg: "", data: null, type: 0 };
    UserModel.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }

            var token = baseController.generateToken(user.email);
            console.log("token: ", token);
            var userobj = {
                photo: user.photoURL,
                email: user.email,
                name: user.fullname,
                id: user._id,
                flagtutorial: user.flagtutorial,
                emailconfirm: user.emailconfirm,
                token: token
            };
            console.log("userobj: ", userobj);
            res.send(userobj);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.id
            });
        });
};

async function createuser(user) {
    console.log("user: ", user);
    var obj = { status: 0, msg: "", data: null, type: 0 };
    // Save Note in the database
    return UserModel.find({ email: user.email }).then(u => {
        if (u.length == 0) {
            return user.save().then(data => {
                var token = encrypt(user.id, user.hash_password);
                email.send(user.email, user.id + "-" + token);
                //res.send(data);


                obj.status = 200;
                obj.msg = "Usuário criado, acesse seu email para confirmar a conta";
                obj.type = 1;
                return obj;

            }).catch(err => {
                console.log("Ocorreu algum erro");
                obj.status = 401;
                obj.msg = "Ocorreu algum erro no cadastro, tente novamente";
                return obj;
            });
        } else {
            console.log("Usuario existente");
            obj.status = 401;
            obj.msg = "Esse usuário já está cadastrado, caso tenha esquecido a senha, clique na opção 'Esqueci a senha'";
            return obj;
        }
    });
};
exports.createuser = (user) => {
    return createuser(user);
};
exports.create = (req, res) => {
    console.log("ADD USER: ", req.body);
    // Validate request
    //if (!req.body.content) {
    //    return res.status(400).send({
    //        message: "Note content can not be empty"
    //    });
    //}
    var hash = makeid(6);
    var pass = encrypt(req.body.password, hash);
    const user = new UserModel({
        photoURL: req.body.photoURL,
        fullname: req.body.fullname,
        email: req.body.email,
        password: pass,
        hash_password: hash,
        flagtutorial: false,
        emailconfirm: false,
        isfacebook: req.body.isfacebook
    });
    // Save Note in the database
    createuser(user).then(retorno => {
        send(res, retorno);
    });
};


async function send(res, retorno) {
    if (retorno.status === 200) {

        res.json({
            success: true,
            message: retorno.msg,
            type: retorno.type
        });
    } else {
        res.json({
            success: false,
            type: retorno.type,
            message: retorno.msg
        });
    }
}
exports.sendconfirm = (req, res) => {
    console.log("SEND CONFIRM USER: ", req.body.email);

    UserModel.find({ email: req.body.email }).then(u => {
        console.log("u: ", u);
        if (u.length > 0) {
            var user = u[0];
            var token = encrypt(user.id, user.hash_password);
            var html = '<a href="http://192.168.15.12:3000/user/confirm/' + user.id + "-" + token + '">Clique aqui para confirmar sua conta</a>';
            email.send(user.email, html);

            res.json({
                success: true,
                message: "Confirmação enviada com sucesso, verifique seu email."
            });
        } else {
            res.json({
                success: false,
                message: "Email não cadastrado, tente outro!"
            });
        }

    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.id
        });
    });

};
exports.resetpassword = (req, res) => {
    console.log("RESET USER: ", req.body);

    UserModel.find({ email: req.body.email }).then(u => {
        console.log("u: ", u);
        if (u.length > 0) {
            var user = u[0];
            if (!user.isfacebook) {
                var token = encrypt(user.id + user.password, user.hash_password);
                var html = '<a href="http://192.168.15.12:3000/changepassword/?token=' + user.id + "-" + token + '">Clique aqui para definir sua nova senha</a>';
                email.send(user.email, html);

                res.json({
                    success: true,
                    message: "Confira seu email para trocar a senha!"
                });
            } else {
                res.json({
                    success: false,
                    message: "Este email está cadastrado via facebook, para logar basta clicar em \"Entrar com o facebook\" e logar na sua conta do facebook"
                });
            }
        } else {
            res.json({
                success: false,
                message: "Email não cadastrado, tente outro!"
            });
        }

    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.id
        });
    });

};
const path = require('path');

exports.changepassword = (req, res) => {
    console.log("CHANGE PASSWORD PAGE");
    res.sendFile('index.html', { root: path.join(__dirname, '../pages') });
};
exports.sendpassword = (req, res) => {
    console.log("CHANGE PASSWORD: ", req.body);
    var id = req.body.token.split("-")[0];
    var token = req.body.token.split("-")[1];

    UserModel.findById(id).then(user => {

        var checktoken = encrypt(user.id + user.password, user.hash_password);
        if (token == checktoken) {
            var password = encrypt(req.body.password, user.hash_password);
            UserModel.findByIdAndUpdate(id, {
                password: password
            }, { new: true }).then(user => {
                if (!user) {
                    res.json({
                        success: false,
                        message: "Email inválido"
                    });
                }
                res.json({
                    success: true,
                    message: "Senha alterada com sucesso"
                });
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.id
                    });
                }
                return res.status(500).send({
                    message: "Error updating note with id " + req.params.id
                });
            });
        } else {
            res.json({
                success: false,
                message: "Token invalido"
            });
        }

    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + id
            });
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + id
        });
    });
};
exports.confirm = (req, res) => {
    console.log("CONFIRM USER: ", req.params.token);
    var data = req.params.token.split("-");
    var id = data[0];
    var token = data[1];
    console.log("id: ", id);
    console.log("token: ", token);


    UserModel.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Note not found with id " + id
                });
            }
            var checktoken = encrypt(id, user.hash_password);
            if (checktoken == token) {
                UserModel.findByIdAndUpdate(id, {
                    emailconfirm: true
                }, { new: true })
                    .then(user => {
                        if (!user) {
                            return res.status(404).send({
                                message: "Note not found with id " + req.params.id
                            });
                        }
                        res.sendFile('success.html', { root: path.join(__dirname, '../pages') });
                    }).catch(err => {
                        if (err.kind === 'ObjectId') {
                            return res.status(404).send({
                                message: "Note not found with id " + req.params.id
                            });
                        }
                        return res.status(500).send({
                            message: "Error updating note with id " + req.params.id
                        });
                    });
            } else {
                return res.status(404).send({
                    message: "Token invalido"
                });
            }


        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + id
            });
        });


};

exports.tutorial = (req, res) => {
    console.log("TUTORIAL: ", req.body.id);
    UserModel.findByIdAndUpdate(req.body.id, {
        flagtutorial: true
    }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            res.json({
                success: true,
                message: "Tutorial finalizado"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.id
            });
        });

};
exports.update = (req, res) => {
    console.log("EDIT USER: ", req.body);
    // Validate Request
    //if (!req.body.content) {
    //    return res.status(400).send({
    //        message: "Note content can not be empty"
    //    });
    //}

    // Find note and update it with the request body

    UserModel.findByIdAndUpdate(req.params.id, {
        photoURL: req.body.photoURL,
        fullname: req.body.fullname,
        email: req.body.email,
        flagtutorial: req.body.flagtutorial,
        emailconfirm: req.body.emailconfirm
    }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.id
            });
        });
};

exports.delete = (req, res) => {
    console.log("DELETE USER: ", req.body);
    UserModel.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            res.send({ message: "Note deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.params.id
            });
        });
};
