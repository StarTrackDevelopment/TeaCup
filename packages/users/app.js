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
    Users.menus.add({
        title: 'Users',
        link: 'all users',
        roles: ['authenticated']
    });
    Users.angularDependencies(['angular-loading-bar']);
    return Users;
});