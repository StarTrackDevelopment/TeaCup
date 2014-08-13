'use strict';

angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Global', 'Users', 'Teacups',
    function ($scope, $stateParams, $location, Global, Users, Teacups) {
        $scope.global = Global;               

        $scope.hasAuthorization = function (teacup) {
            if (!teacup || !teacup.user) return false;
            return $scope.global.isAdmin || teacup.user._id === $scope.global.user._id;
        };

        $scope.hasPicture = function (user) {
            if (!user) return false;
            return user.pictureurl.length > 0;
        };

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

        $scope.findteacups = function() {
            Teacups.query({
                speaker: $stateParams.userId
            }, function(teacups) {
                $scope.teacups = teacups;
            });
        };

        $scope.resetteacups = function () {
            $scope.teacups = undefined;
        };

    }
]);
