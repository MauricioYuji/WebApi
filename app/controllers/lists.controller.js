const ListModel = require('../models/lists.model.js');
const auth = require('../controllers/auth.controller.js');


exports.findAll = (req, res) => {
    var perpage = parseInt(req.query.perpage);
    var s = req.query.s;

    var search = {};
    var regexS = new RegExp('^.*' + s + '', 'i');
    if (s != undefined) {
        search = { name: regexS };
    }
    var query = ListModel.find(search).populate("game", null);
    query.limit(perpage).skip((req.query.page - 1) * perpage).sort({ name: 1 }).then(games => {
        ListModel.countDocuments(search, function (err, count) {
            //console.log("Number of users:", count);
            var json = { "List": games, "Total": count };
            //console.log("req: ", req.token);
            //console.log("json: ", json);
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

    ListModel.findById(req.params.id).populate("img", null)
        .then(games => {
            if (!games) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            res.send(games);
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
    //console.log("ADD list: ", req.body);
    // Validate request
    //console.log("req: ", req.body);
    //if (!req.body.content) {
    //    return res.status(400).send({
    //        message: "Note content can not be empty"
    //    });
    //}


    var obj = req.body;

    var user = auth.getuserrequest(req, res);
    console.log("user: ", user);
    console.log("obj: ", obj);

    const list = new ListModel({
        title: req.body.title || "Untitled List",
        type: req.body.type,
        description: req.body.description,
        status: req.body.status,
        userid: user,
        limit: req.body.limit
    });
    list.save().then(data => {
        console.log("data: ", data);
        res.send(data);

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};
exports.update = (req, res) => {
    console.log("EDIT GAME: ", req.body);

    var obj = req.body;

    // Validate Request
    //if (!req.body.content) {
    //    return res.status(400).send({
    //        message: "Note content can not be empty"
    //    });
    //}

    // Find note and update it with the request body

    ListModel.findByIdAndUpdate(req.params.id, {
        title: req.body.title || "Untitled List",
        type: req.body.type,
        description: req.body.description,
        status: req.body.status,
        limit: req.body.limit
    }, { new: true }).then(list => {
        if (!list) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
        res.send(list);
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
    console.log("DELETE GAME: ", req.body);

    for (var key in req.body) {
        ListModel.findByIdAndDelete(req.body[key]).then(l => {
            console.log("l: ", l);
        });
    }
    res.send({ message: "Note deleted successfully!" });
    //ListModel.findById(req.params.id).then(games => {
    //    console.log("games: ", games);
    //    if (games.img != null) {
    //        ImageModel.findByIdAndRemove(games.img)
    //            .then(img => {


    //                ListModel.findByIdAndRemove(req.params.id).then(game => {
    //                    if (!game) {
    //                        return res.status(404).send({
    //                            message: "Note not found with id " + req.params.id
    //                        });
    //                    }
    //                    res.send({ message: "Note deleted successfully!" });
    //                }).catch(err => {
    //                    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
    //                        return res.status(404).send({
    //                            message: "Note not found with id " + req.params.id
    //                        });
    //                    }
    //                    return res.status(500).send({
    //                        message: "Could not delete note with id " + req.params.id
    //                    });
    //                });

    //            }).catch(err => {
    //                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
    //                    return res.status(404).send({
    //                        message: "Note not found with id " + req.params.id
    //                    });
    //                }
    //                return res.status(500).send({
    //                    message: "Could not delete note with id " + req.params.id
    //                });
    //            });
    //    } else {

    //        ListModel.findByIdAndRemove(req.params.id).then(game => {
    //            if (!game) {
    //                return res.status(404).send({
    //                    message: "Note not found with id " + req.params.id
    //                });
    //            }
    //            res.send({ message: "Note deleted successfully!" });
    //        }).catch(err => {
    //            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
    //                return res.status(404).send({
    //                    message: "Note not found with id " + req.params.id
    //                });
    //            }
    //            return res.status(500).send({
    //                message: "Could not delete note with id " + req.params.id
    //            });
    //        });
    //    }
    //}).catch(err => {
    //    //res.status(500).send({
    //    //    message: err.message || "Some error occurred while retrieving notes."
    //    //});
    //});


};