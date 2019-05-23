const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const GameSchema = mongoose.Schema({
    name: String,
    keygenre: Array,
    keyconsole: Array,
    img: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', GameSchema);

