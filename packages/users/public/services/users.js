'use strict';

angular.module('mean.users').factory('Users', ['$resource',
    function($resource) {
        return $resource('users/:userId', {
        	userId: '@_id'
        }, {
        	update: {
        		method: 'PUT'
        	}
        });
    }
])
.directive('userList', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/users/views/Directives/user-list.html'
    };
});