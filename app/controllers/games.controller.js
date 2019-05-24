const GameModel = require('../models/game.model.js');

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    var perpage = 10;
    var s = req.query.s;
    var g = req.query.g;
    var c = req.query.c;

    var search = {};
    console.log("s: ", s);
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

    console.log("c: ", c);
    var query = GameModel.find(search);
    query.limit(perpage).skip((req.query.page - 1) * perpage)
        .then(games => {
            GameModel.countDocuments(search, function (err, count) {
                console.log("Number of users:", count);
                var json = { "List": games, "Total": count };
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

    // Create a Note
    const game = new GameModel({
        name: req.body.name || "Untitled Game",
        keygenre: req.body.keygenre,
        keyconsole: req.body.keyconsole,
        img: req.body.img
    });

    // Save Note in the database
    game.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });
};
exports.update = (req, res) => {
    console.log("EDIT GAME: ", req.body);
    // Validate Request
    //if (!req.body.content) {
    //    return res.status(400).send({
    //        message: "Note content can not be empty"
    //    });
    //}

    // Find note and update it with the request body


    GameModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name || "Untitled Game",
        keygenre: req.body.keygenre,
        keyconsole: req.body.keyconsole,
        img: req.body.img
    }, { new: true })
        .then(game => {
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
};

exports.delete = (req, res) => {
    console.log("DELETE GAME: ", req.body);
    GameModel.findByIdAndRemove(req.params.id)
        .then(game => {
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
};