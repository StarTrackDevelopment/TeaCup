'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Teacups = new Module('teacups');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Teacups.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Teacups.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Teacups.menus.add({
        title: 'Teacups',
        link: 'all teacups',
        roles: ['authenticated']
    });

    Teacups.menus.add({
        title: 'Create new teacup',
        link: 'create teacup',
        roles: ['authenticated']
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Teacups.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Teacups.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Teacups.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    Teacups.aggregateAsset('css', 'teacups.css');
    Teacups.aggregateAsset('css', 'chart.css');

    return Teacups;
});