'use strict';

//Setting up route
angular.module('mean.teacups').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is connected
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };        
         
        // states for my app
        $stateProvider
            .state('all teacups', {
                url: '/teacups',
                templateUrl: 'teacups/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('speaker teacups', {
                url: '/teacups/speaker',
                templateUrl: 'teacups/views/speakerlist.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('subscribed teacups', {
                url: '/teacups/subscribed',
                templateUrl: 'teacups/views/subscribedlist.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create teacup', {
                url: '/teacups/create',
                templateUrl: 'teacups/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit teacup', {
                url: '/teacups/:teacupId/edit',
                templateUrl: 'teacups/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('teacup by id', {
                url: '/teacups/:teacupId/view',
                templateUrl: 'teacups/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);
