const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var UserSchema = new Schema({
    photoURL: {
        type: String,
        trim: true
    },
    flagtutorial: {
        type: Boolean,
        default: false
    },
    emailconfirm: {
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
        type: String,
        trim: true,
        required: true
    },
    hash_password: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};
module.exports = mongoose.model('User', UserSchema);