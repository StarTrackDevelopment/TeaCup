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

function handleCountRequests(req, res) {
    var filter = {};
    if (req.query.speaker) {
        filter.speaker = req.query.speaker;
    }
    if (req.query.subscribeduser) {
        filter.subscribedusers = req.query.subscribeduser;
    }
    Teacup.count(filter, function(err, count) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp({ count: count });
        }
    });
}

function handleRateRequests(req, res) {
    if (!req.query.user) {
        res.render('error', {
            status: 500
        });
        return;
    }
    var filter = {};
    filter.speaker = req.query.user;
    var query = Teacup.find();
    if (req.query.user) {
        query.where('speaker').equals(req.query.user);
    }
    query.select('comments');
    query.exec(function(err, teacups) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            var result = {};            
            var sum = 0;
            var count = 0;
            var i = teacups.length;
            while (i--) {
                var comments = teacups[i].comments;
                var k = comments.length;
                while (k--) {
                    sum += comments[k].rating;
                    count++;
                }                
            }
            result.count = count;
            result.rating = sum / count;
            res.jsonp(result);
        }
    });
}

exports.all = function (req, res) {
    if (req.query.count) {
        handleCountRequests(req, res);
        return;
    }
    if (req.query.rate) {
        handleRateRequests(req, res);
        return;
    }
    var query = Teacup.find();
    if (req.query.speaker) {
        query.where('speaker').equals(req.query.speaker);
    }
    if (req.query.subscribeduser) {
        query.where('subscribedusers').equals(req.query.subscribeduser);
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
};