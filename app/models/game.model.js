//const mongoose = require('mongoose');
//mongoose.set('useFindAndModify', false);
//const GameSchema = mongoose.Schema({
//    name: String,
//    keygenre: Array,
//    keyconsole: Array,
//    //img: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
//    img: String
//}, {
//        timestamps: true
//    });
////const ImageSchema = mongoose.Schema({
////    name: String,
////    img: String
////}, {
////        timestamps: true
////    });


//module.exports = mongoose.model('Game', GameSchema);
////module.exports = mongoose.model('Image', ImageSchema);





const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageModel = require('./image.model.js');

const GameSchema = Schema({
    name: String,
    keygenre: Array,
    keyconsole: Array,
    img: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

const ImageSchema = Schema({
    name: String,
    img: String
});

const Image = ImageModel;
module.exports = mongoose.model('Game', GameSchema);
//module.exports = mongoose.model('Image', ImageSchema);
//const Game = mongoose.model('Game', GameSchema);