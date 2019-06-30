
exports.default = (req, res) => {
    console.log("REQ", req);
    console.log("RES", res);
    var json = { "Retorno teste": "Sucesso" };

    res.send(json);
};