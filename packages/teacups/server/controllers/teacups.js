'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Teacup = mongoose.model('Teacup'),
    _ = require('lodash');


/**
 * Find teacup by id
 */
exports.teacup = function(req, res, next, id) {
    Teacup.load(id, function(err, teacup) {
        if (err) return next(err);
        if (!teacup) return next(new Error('Failed to load teacup ' + id));
        req.teacup = teacup;
        next();
    });
};

/**
 * Create an teacup
 */
exports.create = function(req, res) {
    var teacup = new Teacup(req.body);
    teacup.user = req.user;

    teacup.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                teacup: teacup
            });
        } else {
            res.jsonp(teacup);
        }
    });
};

/**
 * Update an teacup
 */
exports.update = function(req, res) {
    var teacup = req.teacup;

    teacup = _.extend(teacup, req.body);

    teacup.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                teacup: teacup
            });
        } else {
            res.jsonp(teacup);
        }
    });
};

/**
 * Delete an teacup
 */
exports.destroy = function(req, res) {
    var teacup = req.teacup;

    teacup.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                teacup: teacup
            });
        } else {
            res.jsonp(teacup);
        }
    });
};

/**
 * Show an teacup
 */
exports.show = function(req, res) {
    res.jsonp(req.teacup);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Teacup.find().sort('-created').populate('user', 'name username').exec(function(err, teacups) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(teacups);
        }
    });
};
