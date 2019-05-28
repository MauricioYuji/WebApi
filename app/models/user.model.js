const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

var UserSchema = new Schema({

    photoURL: {
        type: String,
        trim: true
    },
    flagtutorial: {
        type: Boolean,
        default: false
    },
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
    password: {
        type: password,
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
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};
mongoose.model('User', UserSchema);