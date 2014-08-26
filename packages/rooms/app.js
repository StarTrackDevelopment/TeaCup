'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Rooms = new Module('rooms');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Rooms.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Rooms.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Rooms.menus.add({
        title: 'Rooms',
        link: 'all rooms',
        roles: ['authenticated']
    });

    Rooms.menus.add({
        title: 'Add room',
        link: 'create room',
        roles: ['authenticated']
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Rooms.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Rooms.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Rooms.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    Rooms.aggregateAsset('css', 'rooms.css');

    Rooms.angularDependencies(['angular-loading-bar']);

    return Rooms;
});