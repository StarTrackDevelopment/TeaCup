'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Teacups', 'Users',
    function ($scope, Global, Teacups, Users) {
        $scope.global = Global;

        $scope.findnextteacups = function () {
            Teacups.query({
                nextteacups: true
                }, function (teacups) {
                $scope.teacups = teacups;
            });
        };

        $scope.findusers = function() {
            Users.query(function(users) {
                $scope.users = users;
            });
        };

        $scope.isUserSubscribed = function (teacup) {
            var i;
            if (!teacup || !teacup.user) return false;
            for (i in teacup.subscribedusers) {
                if (teacup.subscribedusers[i]._id === $scope.global.user._id) {
                    return true;
                }
            }
            return false;
        };
}]);