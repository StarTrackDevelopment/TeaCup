'use strict';

var rooms = require('../controllers/rooms');

// Room authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.room.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function (res, app, auth) {

    app.route('/rooms')
        .get(rooms.all)
        .post(auth.requiresLogin, rooms.create);
    app.route('/rooms/:roomId')
        .get(rooms.show)
        .put(auth.requiresLogin, hasAuthorization, rooms.update)
        .delete(auth.requiresLogin, hasAuthorization, rooms.destroy);

    app.param('roomId', rooms.room);
};
