'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function(app) {

    app.route('/logout')
        .get(users.signout);
    app.route('/users/me')
        .get(users.me);

    // Setting up the users api
    app.route('/register')
        .post(users.create);

    // Setting up the userId param
    app.param('userId', users.user);

    // AngularJS route to check for authentication
    app.route('/loggedin')
        .get(function(req, res) {
            //res.send(req.isAuthenticated() ? req.user : '0');
            res.send('0');
    });
};