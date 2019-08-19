const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameModel = require('./game.model.js');
const UserModel = require('./user.model.js');
const ImageModel = require('./image.model.js');


const ListSchema = Schema({
    title: String,
    type: Number,
    description: String,
    status: Number,
    limit: Number,
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Games' }],
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

//const GameSchema = Schema({
//    name: String,
//    keygenre: Array,
//    keyconsole: Array,
//    img: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
//});

//const ImageSchema = Schema({
//    name: String,
//    img: String
//});

const Games = GameModel;
const User = UserModel;
const Image = ImageModel;
module.exports = mongoose.model('List', ListSchema);