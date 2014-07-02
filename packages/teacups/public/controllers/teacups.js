'use strict';

angular.module('mean.teacups').controller('TeacupsController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Teacups', 'Users',
    function ($scope, $stateParams, $location, $http, Global, Teacups, Users) {
        $scope.global = Global;

        $scope.hasAuthorization = function(teacup) {
            if (!teacup || !teacup.user) return false;
            return $scope.global.isAdmin || teacup.user._id === $scope.global.user._id;
        };

        $scope.create = function() {
            var teacup = new Teacups({
                title: this.title,
                description: this.description,
                speaker: this.speaker,
                scheduleDate: this.scheduleDate
            });
            teacup.$save(function(response) {
                $location.path('teacups/' + response._id + '/view');
            });

            this.title = '';
            this.description = '';
            this.speaker = '';
            this.scheduleDate = Date.now;
        };

        $scope.remove = function(teacup) {
            if (teacup) {
                teacup.$remove();

                for (var i in $scope.teacups) {
                    if ($scope.teacups[i] === teacup) {
                        $scope.teacups.splice(i, 1);
                    }
                }
            } else {
                $scope.teacup.$remove(function(response) {
                    $location.path('teacups');
                });
            }
        };

        $scope.update = function() {
            var teacup = $scope.teacup;
            if (!teacup.updated) {
                teacup.updated = [];
            }
            teacup.updated.push(new Date().getTime());

            teacup.$update(function() {
                $location.path('teacups/' + teacup._id + '/view');
            });
        };

        $scope.find = function() {
            Teacups.query(function(teacups) {
                $scope.teacups = teacups;
            });
        };

        $scope.findOne = function(populate) {
            Teacups.get({
                teacupId: $stateParams.teacupId,
                populate: populate
            }, function (teacup) {
                $scope.teacup = teacup;
            });
        };

        $scope.findusers = function() {
            Users.query(function(users) {
                $scope.users = users;
            });
        };
    }
]);
