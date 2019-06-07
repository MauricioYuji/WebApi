let config = require('../../config/config');
let jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js');
const crypto = require('crypto');
const algorithm = 'sha256';

function encrypt(password, secret) {
    console.log("password:", password);
    console.log("secret:", secret);
    console.log("algorithm:", algorithm);
    const hash = crypto.createHmac(algorithm, secret)
        .update(password)
        .digest('hex');
    console.log("hash:", hash);
    return hash;
}
function generateToken(username) {
    return jwt.sign({ username: username },
        config.secret,
        {
            expiresIn: '24h' // expires in 24 hours
        }
    );
}
exports.token = (req, res) => {
    var token = generateToken(req.body.username);
    res.json({
        success: true,
        message: 'Authentication successful!',
        token: token
    });
};
exports.index = (req, res) => {
    res.json({
        success: true,
        message: 'Index page'
    });
};
exports.login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    console.log("LOGIN");

    UserModel.find({ email: username }).then(user => {
        user = user[0];
        console.log("user: ", user);
        var pass = encrypt(password, user.hash_password);
        console.log("pass: ", pass);
        console.log("user.password: ", user.password);
        if (pass === user.password) {
            console.log("USER VALID");
            let token = generateToken(username);
            // return the JWT token for the future API calls
            res.json({
                success: true,
                message: 'Authentication successful!',
                token: token
            });
        } else {
            console.log("USER INVALID");
            res.send(403).json({
                success: false,
                message: 'Incorrect username or password'
            });
        }
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            res.send(403).json({
                success: false,
                message: 'Incorrect username or password'
            });
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    });

};