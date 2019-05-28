const UserModel = require('../models/user.model.js');
// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret)
        .update(text)
        .digest('hex');
    return hash;
}

generatetoken = (user) => {
    console.log("GENERATE TOKEN: ", user);
    var uid = "pnNW2hchWBMUFeQxS1yJZYglx2E2";
    var resultvalue = 0;
    var hexstring = "";
    for (var i = 0; i < uid.length; i++) {
        var hex = Number(uid.charCodeAt(i)).toString(16);
        console.log("hex: ", hex);
        hexstring += hex;
        resultvalue += parseInt("0x" + hex);
    }
    console.log("resultvalue: ", resultvalue);


    var hw = encrypt(hexstring);
    console.log(hw);

    return hw;
};
validatetoken = (token) => {
    console.log("GENERATE TOKEN: ", user);
    return true;
};
getId = (uid) => {
    console.log("uid: ", uid);
    return UserModel.find({ uid: uid }).then(user => {
        console.log("user: ", user[0].id);
        return user[0].id;
    }).catch(err => {
        return null;
    });
};
// Retrieve and return all notes from the database.
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
    generatetoken("asd");
    console.log("GET USER: ", req.headers.token);
    getId(req.params.id).then(id => {
        //console.log("id: ", id);
        UserModel.findById(id)
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
    });
};
exports.create = (req, res) => {
    console.log("ADD USER: ", req.body);
    // Validate request
    console.log("req: ", req.body);
    //if (!req.body.content) {
    //    return res.status(400).send({
    //        message: "Note content can not be empty"
    //    });
    //}

    // Create a Note
    const user = new UserModel({
        photoURL: req.body.photoURL,
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        hash_password: req.body.hash_password,
        flagtutorial: req.body.flagtutorial
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
    getId(req.params.id).then(id => {
        console.log("id: ", id);

        UserModel.findByIdAndUpdate(id, {
            uid: req.body.uid,
            photoURL: req.body.photoURL,
            displayName: req.body.displayName,
            email: req.body.email,
            flagtutorial: req.body.flagtutorial
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
    });
};

exports.delete = (req, res) => {
    console.log("DELETE USER: ", req.body);
    getId(req.params.id).then(id => {
        console.log("id: ", id);
        UserModel.findByIdAndRemove(id)
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
    });
};
