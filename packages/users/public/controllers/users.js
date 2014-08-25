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

        $scope.subscribeuser = function (ateacup) {
            var paramid;
            paramid = ateacup._id;
            Teacups.get({
                teacupId: paramid,
                populate: 'false'
            }, function (teacup) {
                teacup.subscribedusers.push($scope.global.user._id);
                if (!teacup.updated) {
                    teacup.updated = [];
                }
                teacup.updated.push(new Date().getTime());
                teacup.$update({}, function () {
                    ateacup.subscribedusers.push($scope.global.user);
                });
            });
        };

        $scope.unsubscribeuser = function (ateacup) {
            var paramid;
            paramid = ateacup._id;
            Teacups.get({
                teacupId: paramid,
                populate: 'false'
            }, function (teacup) {
                for (var i in teacup.subscribedusers) {
                    if (teacup.subscribedusers[i]._id === $scope.global.user._id) {
                        teacup.subscribedusers.splice(i, 1);
                    }
                }

                if (!teacup.updated) {
                    teacup.updated = [];
                }
                teacup.updated.push(new Date().getTime());
                teacup.$update({}, function () {
                    for (var index in ateacup.subscribedusers) {
                        if (ateacup.subscribedusers[index]._id === $scope.global.user._id) {
                            ateacup.subscribedusers.splice(index, 1);
                        }
                    }
                });
            });
        };
    }
]);
