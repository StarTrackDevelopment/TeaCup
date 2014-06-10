'use strict';

var teacups = require('../controllers/teacups');

// Teacup authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.teacup.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Teacups, app, auth) {

    app.route('/teacups')
        .get(teacups.all)
        .post(auth.requiresLogin, teacups.create);
    app.route('/teacups/:teacupId')
        .get(teacups.show)
        .put(auth.requiresLogin, hasAuthorization, teacups.update)
        .delete(auth.requiresLogin, hasAuthorization, teacups.destroy);

    // Finish with setting up the teacupId param
    app.param('teacupId', teacups.teacup);
};
