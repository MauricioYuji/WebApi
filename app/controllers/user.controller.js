const UserModel = require('../models/user.model.js');
// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'sha256';

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
    UserModel.findById(req.params.id)
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
                message: "Error retrieving note with id " + req.params.id
            });
        });
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
        photoURL: "",
        fullname: req.body.fullname,
        email: req.body.email,
        password: pass,
        hash_password: hash,
        flagtutorial: false,
        emailconfirm: false
    });

    // Save Note in the database
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
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
