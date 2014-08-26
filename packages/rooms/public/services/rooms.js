'use strict';

angular.module('mean.rooms')
    .factory('Rooms', [
        '$resource',
        function($resource) {
            return $resource('rooms/:roomId', {
                roomId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ])
    .directive('roomList', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/rooms/views/Directives/room-list.html'
        };
    });