'use strict';

angular.module('mean.teacups').controller('TeacupsController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Teacups', 'Users', 'Rooms',
    function ($scope, $stateParams, $location, $http, Global, Teacups, Users, Rooms) {
        $scope.global = Global;
                
        $scope.hasAuthorization = function(teacup) {
            if (!teacup || !teacup.user) return false;
            return $scope.global.isAdmin || teacup.user._id === $scope.global.user._id;
        };

        $scope.isUserSubscribed = function () {
            if (!$scope.teacup || !$scope.teacup.user) return false;
            for (var i in $scope.teacup.subscribedusers) {
                if ($scope.teacup.subscribedusers[i]._id === $scope.global.user._id) {
                    return true;
                }
            }
            return false;
        };

        $scope.isTeacupinFuture = function () {
            if (!$scope.teacup || !$scope.teacup.scheduleDate) return false;
            if ($scope.teacup.scheduleDate.valueOf() > Date.now().valueOf())
                return true;
            else
                return false;
        };

        $scope.create = function() {
            var teacup = new Teacups({
                title: this.title,
                description: this.description,
                speaker: this.speaker,
                scheduleDate: this.scheduleDate,
                room: this.room
            });
            teacup.$save(function(response) {
                $location.path('teacups/' + response.teacup._id + '/view');
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

            teacup.$update(function () {
                    $location.path('teacups/' + teacup._id + '/view');
            });
        };

        $scope.subscribeuser = function () {
            Teacups.get({
                teacupId: $stateParams.teacupId,
                populate: 'false'
            }, function (teacup) {
                teacup.subscribedusers.push($scope.global.user._id);
                if (!teacup.updated) {
                    teacup.updated = [];
                }
                teacup.updated.push(new Date().getTime());
                teacup.$update();
                $scope.teacup.subscribedusers.push($scope.global.user);
            });
        };

        $scope.addcomment = function () {
            Teacups.get({
                teacupId: $stateParams.teacupId,
                populate: 'false'
            }, function (teacup) {
                var newcomment = {
                    comment: $scope.comment,
                    createdby: $scope.global.user._id,
                    createdwhen: Date.now()
                };
                teacup.comments.push(newcomment);
                if (!teacup.updated) {
                    teacup.updated = [];
                }
                teacup.updated.push(new Date().getTime());
                teacup.$update();
                newcomment.createdby = $scope.global.user;
                $scope.teacup.comments.push(newcomment);
                $scope.comment = '';
            });
        };        

        $scope.unsubscribeuser = function () {
            Teacups.get({
                teacupId: $stateParams.teacupId,
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
                teacup.$update();

                for (i in $scope.teacup.subscribedusers) {
                    if ($scope.teacup.subscribedusers[i]._id === $scope.global.user._id) {
                        $scope.teacup.subscribedusers.splice(i, 1);
                    }
                }
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
        
        $scope.findRooms = function() {
            Rooms.query(function(rooms) {
                $scope.rooms = rooms;
            });
        };
    }
]);
