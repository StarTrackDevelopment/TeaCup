'use strict';

angular.module('mean.controllers.login', [])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location',
        function ($scope, $rootScope, $http, $location) {
            // This object will be filled by the form
            $scope.user = {};

            // Register the login() function
            $scope.login = function () {
                $http.post('/login', {
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .success(function (response) {
                        // authentication OK
                        $scope.loginError = 0;
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        if (response.redirect) {
                            if (window.location.href === response.redirect) {
                                //This is so an admin user will get full admin page
                                window.location.reload();
                            } else {
                                window.location = response.redirect;
                                window.location.reload();
                            }
                        } else {
                            $location.url('/');
                        }
                    })
                    .error(function () {
                        $scope.loginerror = 'Authentication failed.';
                    });
            };
        }
    ])
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location',
        function ($scope, $rootScope, $http, $location) {
            $scope.user = {};

            $scope.register = function () {
                $scope.usernameError = null;
                $scope.registerError = null;

                $http.post('/rest/signup', {
                    name: $scope.user.username,
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .success(function () {
                        // authentication OK
                        $scope.registerError = 0;
                        $rootScope.user = $scope.user;
                        $rootScope.$emit('loggedin');
                        window.location = '#!/userhome';
                        window.location.reload();
                    })
                    .error(function (error) {
                        // Error: authentication failed
                        if (error === 'Username already taken') {
                            $scope.usernameError = error;
                        } else {
                            $scope.registerError = error;
                        }
                    });
            };
        }
    ]);