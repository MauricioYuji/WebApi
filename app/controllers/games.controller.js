const GameModel = require('../models/game.model.js');
const ImageModel = require('../models/image.model.js');
const TesteModel = require('../models/teste.model.js');
const auth = require('../controllers/auth.controller.js');

// Retrieve and return all notes from the database.



//exports.getImages = (req, res) => {

//    var search = {};
//    search["img"] = {
//        $exists: true, $not: { $not: { $eq: "" } }
//    };
//    console.log("search: ", search);
//    var query = GameModel.find(search);
//    query.sort({ name: 1 })
//        .then(games => {
//            GameModel.countDocuments({}, function (err, count) {
//                console.log("Number of users:", count);
//                var json = { "List": games, "Total": count };
//                console.log("req: ", req.token);

//                var time = 0;

//                for (var i = 0; i < games.length; i++) {
//                    let name = games[i].name.replace(/\//g, '');
//                    let id = games[i]._id;
//                    console.log("id: ", id);
//                    console.log("name: ", name);

//                    GameModel.findByIdAndUpdate(id, {
//                        img: undefined
//                    }, { new: true })
//                        .then(game => {
//                            console.log("name: ", name);
//                        }).catch(err => {
//                        });

//                    //var query = ImageModel.find({ "name": name });
//                    //query.sort({ name: 1 })
//                    //    .then(img => {
//                    //        if (img.length > 0) {
//                    //            GameModel.findByIdAndUpdate(id, {
//                    //                img: img[0].id
//                    //            }, { new: true })
//                    //                .then(game => {
//                    //                    console.log("name: ", name);
//                    //                }).catch(err => {
//                    //                });
//                    //        }


//                    //    }).catch(err => {
//                    //        //res.status(500).send({
//                    //        //    message: err.message || "Some error occurred while retrieving notes."
//                    //        //});
//                    //    });
//                }
//                //res.send(json);
//            });
//        }).catch(err => {
//            //res.status(500).send({
//            //    message: err.message || "Some error occurred while retrieving notes."
//            //});
//        });
//};

exports.findAll = (req, res) => {
    var perpage = parseInt(req.query.perpage);
    var s = req.query.s;
    var g = req.query.g;
    var c = req.query.c;

    var search = {};
    //console.log("req.query.perpage: ", req.query.perpage);
    //console.log("s: ", s);
    var regexS = new RegExp('^.*' + s + '', 'i');
    var regexG = new RegExp('^.*' + g + '', 'i');
    if (s != undefined) {
        search = { name: regexS };
    }
    if (g != undefined) {
        search["keygenre"] = { $all: regexG };
    }
    if (c != undefined) {
        c = c.split(",").map(Number);
        search["keyconsole"] = { $all: c };
    }

    //search["img"] = {
    //    $not: {
    //        $eq: ""
    //    }
    //};
    //console.log("c: ", c);
    var query = GameModel.find(search).populate("img", null);
    query.limit(perpage).skip((req.query.page - 1) * perpage).sort({ name: 1 }).then(games => {
        GameModel.countDocuments(search, function (err, count) {
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
    GameModel.findById(req.params.id)
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
    console.log("ADD GAME: ", req.body);
    // Validate request
    console.log("req: ", req.body);
    //if (!req.body.content) {
    //    return res.status(400).send({
    //        message: "Note content can not be empty"
    //    });
    //}


    var obj = req.body;
    obj.img = JSON.parse(obj.img);
    console.log("obj: ", obj);
    var id = null;

    const image = new ImageModel({
        name: req.body.name || "Untitled Game",
        img: obj.img.img
    });
    image.save().then(img => {
        console.log("img.id: ", img.id);
        const game = new GameModel({
            name: req.body.name || "Untitled Game",
            keygenre: req.body.keygenre,
            keyconsole: req.body.keyconsole,
            img: img.id
        });

        console.log("game: ", game);
        // Save Note in the database
        game.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                });
            });

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};
exports.update = (req, res) => {
    console.log("EDIT GAME: ", req.body);

    var obj = req.body;
    obj.img = JSON.parse(obj.img);
    console.log("obj: ", obj);

    // Validate Request
    //if (!req.body.content) {
    //    return res.status(400).send({
    //        message: "Note content can not be empty"
    //    });
    //}

    // Find note and update it with the request body

    if (obj.img._id != null) {

        ImageModel.findByIdAndUpdate(obj.img._id, {
            name: req.body.name || "Untitled Game",
            img: obj.img.img
        }, { new: true }).then(img => {
            if (!img) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.img.id
                });
            } else {
                GameModel.findByIdAndUpdate(req.params.id, {
                    name: req.body.name || "Untitled Game",
                    keygenre: req.body.keygenre,
                    keyconsole: req.body.keyconsole,
                    img: obj.img._id
                }, { new: true }).then(game => {
                    if (!game) {
                        return res.status(404).send({
                            message: "Note not found with id " + req.params.id
                        });
                    }
                    res.send(game);
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
            }

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

        const image = new ImageModel({
            name: req.body.name || "Untitled Game",
            img: obj.img.img
        });

        image.save()
            .then(img => {
                console.log("img: ", img);
                GameModel.findByIdAndUpdate(req.params.id, {
                    name: req.body.name || "Untitled Game",
                    keygenre: req.body.keygenre,
                    keyconsole: req.body.keyconsole,
                    img: img._id
                }, { new: true }).then(game => {
                    if (!game) {
                        return res.status(404).send({
                            message: "Note not found with id " + req.params.id
                        });
                    }
                    res.send(game);
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

            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                });
            });
    }

};

exports.delete = (req, res) => {
    console.log("DELETE GAME: ", req.body);


    GameModel.findById(req.params.id).then(games => {
        console.log("games: ", games);
        if (games.img != null) {
            ImageModel.findByIdAndRemove(games.img)
                .then(img => {


                    GameModel.findByIdAndRemove(req.params.id).then(game => {
                        if (!game) {
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
        } else {

            GameModel.findByIdAndRemove(req.params.id).then(game => {
                if (!game) {
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
        }
    }).catch(err => {
        //res.status(500).send({
        //    message: err.message || "Some error occurred while retrieving notes."
        //});
    });


};