'use strict';

var users = require('../controllers/users');

module.exports = function(res, app, auth) {

    app.route('/users')
        .get(users.all);
    app.route('/users/:userId')
        .get(users.show);

    app.param('userId', users.user);
};
