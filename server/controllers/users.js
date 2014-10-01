'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer');

/**
 * Auth callback
 */
exports.authCallback = function (req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
    res.redirect('/');
};

var sendMail = function(user, res, done) {

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'startrackdevelopment@gmail.com',
            pass: 'Start123!"'
        }
    });    

    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    var address = '';
    if (process.env.NODE_ENV === 'development') {
        address = 'http://localhost:3000/#!/registertoken?token=' + user.token;
    } else {
        address = 'http://teacupapp.herokuapp.com/#!/registertoken?token=' + user.token;
    }

    var mailtext = 'Welcome ' + user.name + '!\n\n';
    mailtext += 'You have succesfully registered to Teacup App.\nYou have to activate your account by clicking on the following link:\n';
    mailtext += address;
    mailtext += '\n\nBest Regards\nYour Teacup Team';

    var mailhtml = '<h2>Welcome ' + user.name + '!</h2>';
    mailhtml += '<p>You have succesfully registered to Teacup App.</p><p>You have to activate your account with clicking on the following link:';
    mailhtml += '<a href=\"' + address;
    mailhtml += '">' + address;
    mailhtml += '</a>';
    mailhtml += '</p>';
    mailhtml += '<p>Best Regards,<br/>Your Teacup Team</p>';

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Teacup App <startrackdevelopment@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Teacup registration token for ' + user.name, // Subject line
        text: mailtext, // plaintext body
        html: mailhtml // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(400).send('Error occured while sendig token email:\n' + error.toString());
            return done('Error occured while sendig token email:\n' + error.toString());
        } else {            
            console.log('Message sent: ' + info.response);
            res.status(200);
            return done();
        }
    });
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
    
    var user = new User(req.body);

    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('email', 'You must be GfK employee').matches('^.*.gfk.com$');
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);    
    req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    user.roles = ['authenticated'];
    //user.token = uuid.v4();
    user.token = new Date().getTime();
    user.tokenauthenticated = false;
    user.save(function (err) {
        if (err) {
            switch (err.code) {
            case 11000:
            case 11001:
                res.status(400).send('Username already taken');
                break;
            default:
                res.status(400).send('Please fill all the required fields');
            }

            return res.status(400);
        }

        sendMail(user, res, function (error) {
            if (error) {
                user.remove(function (erruserdelete) {
                    return res.status(400);
                });
                return res.status(400);
            } else
                return res.redirect('/');
        });

        res.status(200);        
        //return res.redirect('/');

        /*req.logIn(user, function (errlogin) {
            if (errlogin) return next(errlogin);
            return res.redirect('/');
        });*/
    });
};
/**
 * Send User
 */
exports.me = function (req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

/**
* Activate user account
*/
exports.activate = function(req, res) {

    var filter = {};
    if (!req.body.token) {
        console.log('No token');
        res.status(400).send('No token');
        return res.status(400);
    }

    filter.token = req.body.token;

    User
        .findOne(filter)
        .exec(function(err, user) {
            if (err) {
                console.log(err);
                res.status(400).send('Error loading user account: ' + err);
                return res.status(400);
            }
            if (!user) {
                console.log('Failed to load User from token ' + filter.token);
                res.status(400).send('Failed to load User from token ' + filter.token);
                return res.status(400);
            }
            user.tokenauthenticated = true;
            user.save(function(errsave) {
                if (errsave) {
                    console.log('Error saving changes in user account' + errsave);
                    res.status(400).send('Error saving changes in user account' + errsave);
                    return res.status(400);
                } else {
                    return res.redirect('/');
                }
            });
    });
    //req.profile = user;    
//});

    res.status(200);
};