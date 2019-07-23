let config = require('../../config/config');
let jwt = require('jsonwebtoken');
const crypto = require('crypto');
const algorithm = 'sha256';
function generateToken(username) {

    return jwt.sign({ username: username },
        config.secret,
        {
            expiresIn: '24h' // expires in 24 hours
        }
    );
}
exports.encrypt = (password, secret) => {
    //console.log("password:", password);
    //console.log("secret:", secret);
    //console.log("algorithm:", algorithm);
    const hash = crypto.createHmac(algorithm, secret)
        .update(password)
        .digest('hex');
    //console.log("hash:", hash);
    return hash;
};
exports.generateToken = (username) => {
    return generateToken(username);
};
exports.send = (res, retorno) => {
    if (retorno.status === 200) {
        if (retorno.data != null) {
            var token = generateToken(retorno.data.email);
            var user = {
                photo: retorno.data.photoURL,
                email: retorno.data.email,
                name: retorno.data.fullname,
                id: retorno.data._id,
                flagtutorial: retorno.data.flagtutorial,
                emailconfirm: retorno.data.emailconfirm,
                token: token
            };

            res.json({
                success: true,
                message: retorno.msg,
                type: retorno.type,
                data: JSON.stringify(user)
            });
        } else {
            res.json({
                success: true,
                message: retorno.msg,
                type: retorno.type
            });
        }
    } else {
        res.json({
            success: false,
            type: retorno.type,
            message: retorno.msg
        });
    }
}
