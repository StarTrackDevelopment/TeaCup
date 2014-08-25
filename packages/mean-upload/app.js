'use strict';


var Module = require('meanio').Module;

var MeanUpload = new Module('mean-upload');

process.env.TMPDIR = '.';


MeanUpload.register(function(app, auth, database) {

    MeanUpload.routes(app, auth, database);

    MeanUpload.aggregateAsset('css', '/public/assets/css/meanUpload.css', {
        absolute: true
    });

    MeanUpload.angularDependencies(['angularFileUpload']);

    return MeanUpload;
});
