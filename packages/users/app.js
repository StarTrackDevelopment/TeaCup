'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Users = new Module('users');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Users.register(function (app, auth, database) {
    //We enable routing. By default the Package Object is passed to the routes
    Users.routes(app, auth, database);
    return Users;
});