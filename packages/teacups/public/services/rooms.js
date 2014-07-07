'use strict';

angular.module('mean.teacups').factory('Rooms', [
    '$resource',
    function($resource) {
        return $resource('rooms');
    }
]);