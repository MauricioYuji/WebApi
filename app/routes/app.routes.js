module.exports = (app) => {
    const auth = require('../controllers/auth.controller.js');
    const games = require('../controllers/games.controller.js');
    const images = require('../controllers/images.controller.js');
    const user = require('../controllers/user.controller.js');
    const middleware = require('../middlewares/middleware');

    app.post('/login', auth.login);
    app.post('/token', middleware.checkToken, auth.token);
    app.get('/', middleware.checkToken, auth.index);
    // Retrieve all Notes
    app.get('/gamesimages', games.getImages);
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


    app.get('/images', middleware.checkToken, images.findAll);
    app.get('/images/:id', middleware.checkToken, images.findOne);
    app.post('/images/add', middleware.checkToken, images.create);
    app.put('/images/edit/:id', middleware.checkToken, images.update);
    app.delete('/images/delete/:id', middleware.checkToken, images.delete);
}