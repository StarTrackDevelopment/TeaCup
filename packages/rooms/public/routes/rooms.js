'use strict';

angular.module('mean.rooms').config(['$stateProvider',
    function($stateProvider) {
        var checkLoggedin = function($q, $timeout, $http, $location) {
            var deferred = $q.defer();
            $http.get('/loggedin').success(function(user) {
                if (user !== '0') $timeout(deferred.resolve);
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });
            return deferred.promise;
        };        
         
        $stateProvider
            .state('all rooms', {
                url: '/rooms',
                templateUrl: 'rooms/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })            
            .state('create room', {
                url: '/rooms/create',
                templateUrl: 'rooms/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit room', {
                url: '/rooms/:roomId/edit',
                templateUrl: 'rooms/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('room by id', {
                url: '/rooms/:roomId/view',
                templateUrl: 'rooms/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);
