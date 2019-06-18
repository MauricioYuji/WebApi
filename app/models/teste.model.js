const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const TesteSchema = mongoose.Schema({
    name: String,
    descricao: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Teste', TesteSchema);

