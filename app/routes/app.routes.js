module.exports = (app) => {
    const games = require('../controllers/games.controller.js');
    const user = require('../controllers/user.controller.js');

    // Retrieve all Notes
    app.get('/games', games.findAll);
    app.get('/games/:id', games.findOne);
    app.post('/games/add', games.create);
    app.put('/games/edit/:id', games.update);
    app.delete('/games/delete/:id', games.delete);


    app.get('/user', user.findAll);
    app.get('/user/:id', user.findOne);
    app.post('/user/add', user.create);
    app.put('/user/edit/:id', user.update);
    app.delete('/user/delete/:id', user.delete);
}