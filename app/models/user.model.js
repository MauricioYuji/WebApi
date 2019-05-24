const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const UserSchema = mongoose.Schema({
    uid: String,
    photoURL: String,
    displayName: String,
    email: String,
    flagtutorial: Boolean
}, {
        timestamps: true
    });

module.exports = mongoose.model('User', UserSchema);

