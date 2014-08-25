'use strict';

//Setting up route
    angular.module('mean.system').config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // For unmatched routes:
            $urlRouterProvider.otherwise('/');

            // states for my app
            $stateProvider              
                .state('home', {
                    url: '/',
                    templateUrl: 'public/system/views/index.html'
                })
                .state('homeuser', {
                    url: '/userhome',
                    templateUrl: 'public/system/views/userhome.html'
                })
                .state('auth', {
                    templateUrl: 'public/auth/views/index.html'
                });
        }
    ])
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);
