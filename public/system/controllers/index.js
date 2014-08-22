'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Teacups', 'Users',
    function ($scope, Global, Teacups, Users) {
        $scope.global = Global;
        $scope.teacups = '';
        $scope.nextmeetingasspeaker = '';
        $scope.nextsubscribedmeeting = '';
        $scope.speakerteacupscount = '';
        $scope.subscribedteacupscount = '';
        $scope.userrating = '';
        $scope.userratingcount = '';

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
                teacup.$update({}, function() {
                    ateacup.subscribedusers.push($scope.global.user);
                    $scope.calculateuserinfo();
                    $scope.getsubscribedteacupscount();
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
                teacup.$update({}, function() {
                    for (var index in ateacup.subscribedusers) {
                        if (ateacup.subscribedusers[index]._id === $scope.global.user._id) {
                            ateacup.subscribedusers.splice(index, 1);
                        }
                    }
                    $scope.calculateuserinfo();
                    $scope.getsubscribedteacupscount();
                });
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

        $scope.getspeakerteacupscount = function () {
            var filter = {};
            filter.count = true;
            filter.speaker = $scope.global.user._id;
            Teacups.get(filter, function (res) {
                $scope.speakerteacupscount = res.count;
            });
        };

        $scope.getsubscribedteacupscount = function () {
            var filter = {};
            filter.count = true;
            filter.subscribeduser = $scope.global.user._id;
            Teacups.get(filter, function (res) {
                $scope.subscribedteacupscount = res.count;
            });
        };

        $scope.getuserrate = function () {
            var filter = {};
            filter.rate = true;
            filter.user = $scope.global.user._id;
            Teacups.get(filter, function (res) {
                $scope.userrating = res.rating;
                $scope.userratingcount = res.count;
            });
        };
    }]);