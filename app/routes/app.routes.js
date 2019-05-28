module.exports = (app) => {
    const games = require('../controllers/games.controller.js');
    const user = require('../controllers/user.controller.js');
    const middleware = require('../middlewares/middleware');

    // Retrieve all Notes
    app.get('/games', middleware.checkToken, games.findAll);
    app.get('/games/:id', middleware.checkToken, games.findOne);
    app.post('/games/add', middleware.checkToken, games.create);
    app.put('/games/edit/:id', middleware.checkToken, games.update);
    app.delete('/games/delete/:id', middleware.checkToken, games.delete);


    app.get('/user', middleware.checkToken, user.findAll);
    app.get('/user/:id', middleware.checkToken, user.findOne);
    app.post('/user/add', user.create);
    app.put('/user/edit/:id', middleware.checkToken, user.update);
    app.delete('/user/delete/:id', middleware.checkToken, user.delete);


}