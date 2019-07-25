let config = require('../../config/config');
let jwt = require('jsonwebtoken');
const crypto = require('crypto');
const algorithm = 'sha256';
const path = require('path');

exports.makeid = (length) => {

    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.encrypt = (password, secret) => {
    const hash = crypto.createHmac(algorithm, secret)
        .update(password)
        .digest('hex');
    return hash;
};
exports.generateToken = (username) => {
    return jwt.sign({ username: username },
        config.secret,
        {
            expiresIn: '24h' // expires in 24 hours
        }
    );
};
exports.send = (res, retorno) => {
    if (retorno.status === 200) {
        if (retorno.data != null) {
            res.json({
                success: true,
                token: retorno.token,
                message: retorno.msg,
                type: retorno.type,
                data: JSON.stringify(retorno.data)
            });
        } else {
            res.json({
                success: true,
                message: retorno.msg,
                token: retorno.token,
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
};
exports.sendfile = (res, retorno) => {
    if (retorno.status === 200) {
        res.sendFile(retorno.data, { root: path.join(__dirname, '../pages') });
    } else {
        res.sendFile('error.html', { root: path.join(__dirname, '../pages') });
    }
}