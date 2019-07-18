
const email = require('../controllers/email.controller.js');
exports.default = (req, res) => {
    console.log("REQ", req);
    console.log("RES", res);
    var json = { "Retorno teste": "Sucesso" };
    email.send("yuji.shima09@gmail.com", "validateURL");
    res.send(json);
};