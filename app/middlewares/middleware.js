let jwt = require('jsonwebtoken');
const config = require('../../config/config');

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

                return res.status(400).send({
                    message: "Token is not valid"
                });
                //return res.json({
                //    success: false,
                //    message: 'Token is not valid'
                //});
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
        return res.status(400).send({
            message: "Auth token is not supplied"
        });
        //return res.json({
        //    success: false,
        //    message: 'Auth token is not supplied'
        //});
    }
};

module.exports = {
    checkToken: checkToken
}