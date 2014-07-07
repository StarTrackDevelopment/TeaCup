'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Room = mongoose.model('Room');

/**
 * List of rooms
 */
exports.all = function(req, res) {
    Room.find()   
        .exec(function (err, rooms) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(rooms);
        }
    });
};