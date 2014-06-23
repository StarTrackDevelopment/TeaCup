'use strict';

angular.module('mean.teacups').controller('TeacupsController', ['$scope', '$stateParams', '$location', 'Global', 'Teacups',
    function($scope, $stateParams, $location, Global, Teacups) {
        $scope.global = Global;

        $scope.hasAuthorization = function(teacup) {
            if (!teacup || !teacup.user) return false;
            return $scope.global.isAdmin || teacup.user._id === $scope.global.user._id;
        };

        $scope.create = function() {
            var teacup = new Teacups({
                title: this.title,
                description: this.description,
                scheduleDate: this.scheduleDate
            });
            teacup.$save(function(response) {
                $location.path('teacups/' + response._id);
            });

            this.title = '';
            this.description = '';
            this.scheduleDate = new Date();
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
                $location.path('teacups/' + teacup._id);
            });
        };

        $scope.find = function() {
            Teacups.query(function(teacups) {
                $scope.teacups = teacups;
            });
        };

        $scope.findOne = function() {
            Teacups.get({
                teacupId: $stateParams.teacupId
            }, function(teacup) {
                $scope.teacup = teacup;
            });
        };
    }
]);
