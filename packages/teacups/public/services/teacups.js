'use strict';

angular.module('mean.teacups')
    .factory('Teacups', [
        '$resource',
        function($resource) {
            return $resource('teacups/:teacupId', {
                teacupId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ])
    .directive('teacupList', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/teacups/views/Directives/teacup-list.html'
        };
    });

angular.module('mean.teacups')
    .directive('teacupComments', function() {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '/teacups/views/Directives/teacup-comments.html'
        };
    });