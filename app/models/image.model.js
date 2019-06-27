const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = Schema({
    name: String,
    img: String
});

module.exports = mongoose.model('Image', ImageSchema);