'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Teacups', 'Users',
    function ($scope, Global, Teacups, Users) {
        $scope.global = Global;
        $scope.teacups = '';
        $scope.nextmeetingasspeaker = '';
        $scope.nextsubscribedmeeting = '';

        $scope.init = function (calculateuserinfo) {
            Teacups.query({
                nextteacups: true
                }, function (teacups) {
                    $scope.teacups = teacups;
                    if (calculateuserinfo)
                        $scope.calculateuserinfo();
            });
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
                teacup.$update();
                ateacup.subscribedusers.push($scope.global.user);
                $scope.calculateuserinfo();
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
                teacup.$update();                

                for (i in ateacup.subscribedusers) {
                    if (ateacup.subscribedusers[i]._id === $scope.global.user._id) {
                        ateacup.subscribedusers.splice(i, 1);
                    }
                }
                $scope.calculateuserinfo();
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

        $scope.calculateuserinfo = function () {
            $scope.nextmeetingasspeaker = '';
            $scope.nextsubscribedmeeting = '';
            if (!$scope.teacups || !$scope.teacups.length)
                return false;
            for (var i in $scope.teacups) {
                var teacup = $scope.teacups[i];
                if (!$scope.nextmeetingasspeaker && teacup.speaker._id === $scope.global.user._id) {
                    $scope.nextmeetingasspeaker = teacup;
                }
                if (!$scope.nextsubscribedmeeting && $scope.isUserSubscribed(teacup)) {
                    $scope.nextsubscribedmeeting = teacup;
                }
            }
            return true;
        };

        $scope.getteacupfromcollection = function(teacup) {
            for (var i in $scope.teacups) {
                if ($scope.teacups[i] === teacup) {
                    return $scope.teacups[i];
                }
            }
            return null;
        };
    }]);