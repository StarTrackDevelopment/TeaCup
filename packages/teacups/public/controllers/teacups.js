'use strict';

angular.module('mean.teacups')
.controller('TeacupsController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Teacups', 'Users', 'Rooms',
    function ($scope, $stateParams, $location, $http, Global, Teacups, Users, Rooms) {
        $scope.global = Global;

        $scope.scheduleDateString = '';
        $scope.scheduleTimeString = '';
        $scope.isinit = true;

        $scope.$watch('teacup.scheduleDate', function (newValue, oldValue) {
            if (!$scope.isinit || !newValue) return;
            var date = new Date(newValue);
            var year = date.getFullYear();
            var monthint = parseInt(date.getMonth());
            var month = (monthint + 1 < 10 ? '0' + (monthint + 1) : (monthint + 1));
            var dayint = parseInt(date.getDate());
            var day = (dayint < 10 ? '0' + dayint : dayint);
            $scope.scheduleDateString = year + '-' + month + '-' + day;
            var hoursint = parseInt(date.getHours()); 
            var hours = (hoursint < 10 ? '0' + hoursint : hoursint);
            var minutesint = parseInt(date.getMinutes());
            var minutes = (minutesint < 10 ? '0' + minutesint : minutesint);
            $scope.scheduleTimeString = hours + ':' + minutes;
            $scope.isinit = false;
        });

        $scope.scheduleDateChanged = function(isEdit) {
            if (isEdit && !$scope.teacup) return;
            var str = $scope.scheduleDateString.toString();
            var strtime = $scope.scheduleTimeString.toString();
            var year = str.substr(0, 4);
            var month = str.substr(5, 2);
            var day = str.substr(8, 2);
            var hours = strtime.substr(0, 2);
            var minutes = strtime.substr(3, 2);
            if (isEdit) {
                $scope.teacup.scheduleDate = new Date(year, month - 1, day, hours, minutes);
                //(year + '-' + (month - 1) + '-' + day + 'T' + hours + ':' + minutes + '00.000Z');
            } else {
                this.scheduleDate = new Date(year, month - 1, day, hours, minutes);
            }
        };

        $scope.hasAuthorization = function(teacup) {
            if (!teacup || !teacup.user) return false;
            return $scope.global.isAdmin || teacup.user._id === $scope.global.user._id;
        };
        
        $scope.isUserSubscribed = function (teacup) {
            var i;
            if (teacup) {
                if (!teacup.user) return false;
                for (i in teacup.subscribedusers) {
                    if (teacup.subscribedusers[i]._id === $scope.global.user._id) {
                        return true;
                    }
                }
            } else {
                if (!$scope.teacup || !$scope.teacup.user) return false;
                for (i in $scope.teacup.subscribedusers) {
                    if ($scope.teacup.subscribedusers[i]._id === $scope.global.user._id) {
                        return true;
                    }
                }
            }
            return false;
        };

        $scope.isFullyBooked = function (teacup) {
            if (teacup) {
                if (!teacup.room)
                    return false;
                return ((teacup.room.capacity - teacup.subscribedusers.length) <= 0);
            } else {
                if (!$scope.teacup || !$scope.teacup.room)
                    return false;
                return (($scope.teacup.room.capacity - $scope.teacup.subscribedusers.length) <= 0);
            }
        };

        $scope.create = function() {
            var teacup = new Teacups({
                title: this.title,
                description: this.description,
                speaker: this.speaker,
                room: this.room,
                scheduleDate: this.scheduleDate
            });
            teacup.$save(function(response) {
                $location.path('teacups/' + response._id + '/view');
            });

            this.title = '';
            this.description = '';
            this.speaker = '';
            this.room = '';
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
                $location.path('userhome');
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

        $scope.subscribeuser = function (ateacup) {
            var tmpteacup;
            var paramid;
            if (!ateacup) {
                tmpteacup = $scope.teacup;
                paramid = $stateParams.teacupId;
            } else {
                tmpteacup = ateacup;
                paramid = ateacup._id;
            }
            Teacups.get({
                teacupId: paramid,
                populate: 'false'
            }, function (teacup) {
                teacup.subscribedusers.push($scope.global.user._id);
                if (!teacup.updated) {
                    teacup.updated = [];
                }
                teacup.updated.push(new Date().getTime());
                teacup.$update();
                tmpteacup.subscribedusers.push($scope.global.user);
            });
        };

        $scope.unsubscribeuser = function (ateacup) {
            var tmpteacup;
            var paramid;
            if (!ateacup) {
                tmpteacup = $scope.teacup;
                paramid = $stateParams.teacupId;
            } else {
                tmpteacup = ateacup;
                paramid = ateacup._id;
            }
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
                teacup.$update();

                for (i in tmpteacup.subscribedusers) {
                    if (tmpteacup.subscribedusers[i]._id === $scope.global.user._id) {
                        tmpteacup.subscribedusers.splice(i, 1);
                    }
                }
            });
        };

        $scope.addcomment = function () {
            Teacups.get({
                teacupId: $stateParams.teacupId,
                populate: 'false'
            }, function (teacup) {
                var newcomment = {
                    rating: $scope.rating,
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
                $scope.rating = 1;
            });
        };                

        $scope.find = function() {
            Teacups.query(function(teacups) {
                $scope.teacups = teacups;
            });
        };

        $scope.findspeakerteacups = function () {
            Teacups.query({
                speaker: $scope.global.user._id
            }, function (teacups) {
                $scope.teacups = teacups;
            });
        };

        $scope.findsubscribedteacups = function () {
            Teacups.query({
                subscribeduser: $scope.global.user._id
            }, function (teacups) {
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

        $scope.findrooms = function () {
            Rooms.query(function (rooms) {
                $scope.rooms = rooms;
            });
        };

        $scope.goto = function (path) {
            $location.path(path);
        };
    }
]);