const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

var AuthSchema = new Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    hash_password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
});
AuthSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};
mongoose.model('Auth', AuthSchema);