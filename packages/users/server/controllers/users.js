'use strict';

    /**
     * Module dependencies.
     */
var mongoose = require('mongoose'),
    User = mongoose.model('User');
    //_ = require('lodash');


exports.user = function (req, res, next, id) {
    User.load(id, function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load user ' + id));
        req.user = user;
        next();
    });
};

exports.show = function (req, res) {
    res.jsonp(req.user);
};

exports.all = function (req, res) {
    User.find().sort('-username').exec(function (err, users) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(users);
        }
    });
};
