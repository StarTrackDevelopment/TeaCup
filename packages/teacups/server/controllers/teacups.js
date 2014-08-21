'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Teacup = mongoose.model('Teacup'),
    _ = require('lodash');


/*var getParameterValue = function(name, query) {
    if (!query)
        return null;
    var pairs = query.split('&amp;');
    var numberOfArguments = pairs.length;
    for (var i = 0; i < numberOfArguments; i++) {
        var pos = pairs[i].indexOf('=');

        if (pos === -1) {
            continue;
        }

        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);

        if (argname === name)
            return value;
    }
    return null;
};*/
/**
 * Find teacup by id
 */
exports.teacup = function (req, res, next, id) {
    Teacup.load(id, req.query.populate, function (err, teacup) {
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
 * List of Teacups
 */
exports.all = function (req, res) {
    if (!req.query.count) {
        var query = Teacup.find();
        if (req.query.speaker) {
            query.where('speaker').equals(req.query.speaker);
        }
        if (req.query.nextteacups) {
            query.where('scheduleDate').gt(Date.now());
        }
        query.sort({ scheduleDate: 'asc' });
        query.populate('user speaker')
            .populate('subscribedusers')
            .populate('comments.createdby');
        query.exec(function(err, teacups) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(teacups);
            }
        });
    } else {
        var filter = {};
        if (req.query.speaker) {            
            filter.speaker = req.query.speaker;
        }
        if (req.query.subscribeduser) {
            filter.subscribedusers = req.query.subscribeduser;
        }
        Teacup.count(filter, function (err, count) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp({ count: count });
            }         
        });
    }
};