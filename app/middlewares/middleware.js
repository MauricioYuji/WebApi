let jwt = require('jsonwebtoken');
const config = require('../../config/config');
const baseController = require('../controllers/base.controller');

const obj = { status: 0, msg: "", data: null, type: 0 };

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token != undefined) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
    }
    //console.log("check token: ", token);
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {

                obj.status = 400;
                obj.msg = "Usu�rio expirou, fa�a login novamente.";
                baseController.send(res, obj);

            } else {
                let token = jwt.sign({ username: 'Admin' },
                    config.secret,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                req.decoded = decoded;
                req.token = token;
                next();
            }
        });
    } else {

        obj.status = 400;
        obj.msg = "Usu�rio n�o autenticado, fa�a login novamente.";
        baseController.send(res, obj);
    }
};

module.exports = {
    checkToken: checkToken
}