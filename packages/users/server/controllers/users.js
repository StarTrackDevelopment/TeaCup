'use strict';

    /**
     * Module dependencies.
     */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');


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

exports.update = function (req, res) {
    var user = req.user;

    user = _.extend(user, req.body);

    user.save(function (err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                user: user
            });
        } else {
            res.jsonp(user);
        }
    });
};