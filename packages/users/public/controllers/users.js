'use strict';

angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Global', 'Users',
    function ($scope, $stateParams, $location, Global, Users) {
        $scope.global = Global;               

        $scope.findOne = function() {
            Users.get({
                userId: $stateParams.userId
            }, function(user) {
                $scope.user = user;
            });
        };

        $scope.find = function () {
            Users.query(function (users) {
                $scope.users = users;
            });
        };
    }
]);
