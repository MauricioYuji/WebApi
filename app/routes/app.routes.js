module.exports = (app) => {
    const games = require('../controllers/games.controller.js');

    // Retrieve all Notes
    app.get('/games', games.findAll);
    app.get('/games/:id', games.findOne);
    app.post('/games/add', games.create);
    app.put('/games/edit/:id', games.update);
    app.delete('/games/delete/:id', games.delete);
}