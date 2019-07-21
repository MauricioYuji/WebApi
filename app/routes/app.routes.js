module.exports = (app) => {
    const teste = require('../controllers/teste.controller.js');
    const auth = require('../controllers/auth.controller.js');
    const games = require('../controllers/games.controller.js');
    const images = require('../controllers/images.controller.js');
    const user = require('../controllers/user.controller.js');
    const middleware = require('../middlewares/middleware');

    app.get('/teste', teste.default);
    app.get('/page', teste.page);

    app.post('/login', auth.login);
    app.post('/loginwithfacebook', auth.loginfacebook);
    app.post('/signinwithfacebook', auth.signinfacebook);
    app.post('/token', middleware.checkToken, auth.gettoken);
    app.get('/', middleware.checkToken, auth.index);

    app.get('/games', middleware.checkToken, games.findAll);
    app.get('/games/:id', middleware.checkToken, games.findOne);
    app.post('/games/add', middleware.checkToken, games.create);
    app.put('/games/edit/:id', middleware.checkToken, games.update);
    app.delete('/games/delete/:id', middleware.checkToken, games.delete);


    app.get('/user', middleware.checkToken, user.findAll);
    app.get('/user/:id', middleware.checkToken, user.findOne);

    app.post('/user/add', user.create);
    app.post('/user/sendconfirm', user.sendconfirm);
    app.post('/user/resetpassword', user.resetpassword);
    app.post('/user/changepassword', user.changepassword);
    app.get('/user/confirm/:token', user.confirm);
    app.put('/user/edit/:id', middleware.checkToken, user.update);
    app.delete('/user/delete/:id', middleware.checkToken, user.delete);


    app.get('/images', middleware.checkToken, images.findAll);
    app.get('/images/:id', middleware.checkToken, images.findOne);
    app.post('/images/add', middleware.checkToken, images.create);
    app.put('/images/edit/:id', middleware.checkToken, images.update);
    app.delete('/images/delete/:id', middleware.checkToken, images.delete);
}