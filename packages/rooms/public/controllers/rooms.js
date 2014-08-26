'use strict';

angular.module('mean.rooms')
.controller('RoomsController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Rooms',
    function ($scope, $stateParams, $location, $http, Global, Rooms) {
        $scope.global = Global;

        $scope.hasAuthorization = function(room) {
            if (!room || !room.user) return false;
            return $scope.global.isAdmin || room.user._id === $scope.global.user._id;
        };
               
        $scope.create = function() {
            var room = new Rooms({
                name: this.name,
                office: this.office,
                capacity: this.capacity,
                instrumentation: this.instrumentation
            });
            room.$save(function(response) {
                $location.path('rooms/' + response._id + '/view');
            });

            this.name = '';
            this.office = '';
            this.capacity = '';
            this.instrumentation = '';
        };

        $scope.remove = function(room) {
            if (room) {
                room.$remove();

                for (var i in $scope.rooms) {
                    if ($scope.rooms[i] === room) {
                        $scope.rooms.splice(i, 1);
                    }
                }
            } else {
                $scope.room.$remove(function (response) {
                    $location.path('rooms');
                });
            }
        };

        $scope.update = function() {
            var room = $scope.room;
            if (!room.updated) {
                room.updated = [];
            }
            room.updated.push(new Date().getTime());

            room.$update(function () {
                $location.path('rooms/' + room._id + '/view');
            });
        };                        

        $scope.find = function() {
            Rooms.query(function (rooms) {
                $scope.rooms = rooms;
            });
        };        

        $scope.findOne = function() {
            Rooms.get({
                roomId: $stateParams.roomId,
            }, function (room) {
                $scope.room = room;
            });
        };
    }
]);