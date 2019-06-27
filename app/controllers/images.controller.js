const ImageModel = require('../models/image.model.js');
//const ImageModel.images = require('../models/images.model.js');
const TesteModel = require('../models/teste.model.js');
const auth = require('../controllers/auth.controller.js');

// Retrieve and return all notes from the database.




exports.findAll = (req, res) => {
    var perpage = parseInt(req.query.perpage);
    var s = req.query.s;

    var search = {};
    console.log("req.query.perpage: ", req.query.perpage);
    console.log("s: ", s);
    var regexS = new RegExp('^.*' + s + '', 'i');
    if (s != undefined) {
        search = { name: regexS };
    }

    //search["img"] = {
    //    $not: {
    //        $eq: ""
    //    }
    //};

    var query = ImageModel.find(search);
    query.limit(perpage).skip((req.query.page - 1) * perpage).sort({ name: 1 }).then(images => {
        ImageModel.countDocuments(search, function (err, count) {
            console.log("Number of users:", count);
            var json = { "List": images, "Total": count };
            console.log("req: ", req.token);
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
    ImageModel.findById(req.params.id)
        .then(images => {
            if (!images) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            res.send(images);
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
    const image = new ImageModel.images({
        name: req.body.name || "Untitled Image",
        img: req.body.img
    });

    // Save Note in the database
    image.save()
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


    ImageModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name || "Untitled Image",
        img: req.body.img
    }, { new: true })
        .then(image => {
            if (!image) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                });
            }
            res.send(image);
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
    ImageModel.findByIdAndRemove(req.params.id)
        .then(image => {
            if (!image) {
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