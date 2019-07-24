const UserModel = require('../models/user.model.js');
const emailController = require('../controllers/email.controller.js');
const baseController = require('../controllers/base.controller.js');
const obj = { status: 0, msg: "", data: null, type: 0 };

exports.createuser = (res, user) => {
    return UserModel.find({ email: user.email }).then(u => {
        if (u.length == 0) {
            return user.save().then(data => {
                var token = baseController.encrypt(user.id, user.hash_password);
                var html = '<a href="http://192.168.15.12:3000/confirm/' + user.id + '-' + token + '">Clique aqui para confirmar sua conta</a>';
                emailController.send(user.email, html, "Confirmação de conta");
                obj.status = 200;
                obj.msg = "Usuário criado, acesse seu email para confirmar a conta.";
                obj.type = 1;
                baseController.send(res, obj);

            }).catch(err => {
                obj.status = 401;
                obj.msg = "Ocorreu algum erro no cadastro, tente novamente.";
                baseController.send(res, obj);
            });
        } else {
            obj.status = 401;
            obj.msg = "Esse usuário já está cadastrado, caso tenha esquecido a senha, clique na opção 'Esqueci a senha'.";
            baseController.send(res, obj);
        }
    });
};
exports.tutorial = (req, res) => {
    UserModel.findByIdAndUpdate(req.body.id, {
        flagtutorial: true
    }, { new: true })
        .then(user => {
            if (!user) {
                obj.status = 404;
                obj.msg = "Usuário não localizado.";
            } else {
                obj.status = 200;
                obj.msg = "Tutorial finalizado.";
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
exports.create = (req, res) => {
    var hash = baseController.makeid(6);
    var pass = baseController.encrypt(req.body.password, hash);
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
    this.createuser(res, user);
};
exports.findOne = (req, res) => {
    UserModel.findById(req.params.id)
        .then(user => {
            if (!user) {
                obj.status = 404;
                obj.msg = "Alguma informação não foi localizada, confira as informações e tente novamente.";
            } else {
                var token = baseController.generateToken(user.email);
                var userobj = {
                    photo: user.photoURL,
                    email: user.email,
                    name: user.fullname,
                    id: user._id,
                    flagtutorial: user.flagtutorial,
                    emailconfirm: user.emailconfirm
                };
                obj.status = 200;
                obj.msg = "Usuário retornado com sucesso.";
                obj.data = userobj;
                obj.token = token;
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
                var json = { "List": user, "Total": count };
                obj.status = 200;
                obj.msg = "Usuários retornado com sucesso.";
                obj.data = json;

                baseController.send(res, obj);
            });
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
exports.update = (req, res) => {

    UserModel.findByIdAndUpdate(req.params.id, {
        photoURL: req.body.photoURL,
        fullname: req.body.fullname,
        email: req.body.email,
        flagtutorial: req.body.flagtutorial,
        emailconfirm: req.body.emailconfirm
    }, { new: true })
        .then(user => {
            if (!user) {
                obj.status = 404;
                obj.msg = "Usuários não localizado.";
            } else {
                obj.status = 200;
                obj.msg = "Usuários atualizado com sucesso.";
                obj.data = user;
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
exports.delete = (req, res) => {
    UserModel.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                obj.status = 404;
                obj.msg = "Usuários não localizado.";
            } else {
                obj.status = 200;
                obj.msg = "Usuários deletado com sucesso.";
                obj.data = user;
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
