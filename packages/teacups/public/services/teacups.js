'use strict';

angular.module('mean.teacups').factory('Teacups', ['$resource',
    function($resource) {
        return $resource('teacups/:teacupId', {
        	teacupId: '@_id'
        }, {
        	update: {
        		method: 'PUT'
        	}
        });
    }
]);
