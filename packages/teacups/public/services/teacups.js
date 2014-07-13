'use strict';

angular.module('mean.teacups')
    .factory('Teacups', [
        '$resource',
        function($resource) {
            return $resource('teacups/:teacupId', {
                teacupId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ])
    .directive('teacupList', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/teacups/views/Directives/teacup-list.html'
        };
    });

angular.module('mean.teacups')
    .directive('teacupComments', function() {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '/teacups/views/Directives/teacup-comments.html'
        };
    });

angular.module('mean.teacups')
    .directive('teacupAddcomment', function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '/teacups/views/Directives/teacup-addcomment.html'
        };
    });

angular.module('mean.teacups')
    .directive('teacupRating', function () {
        return {
            restrict: 'E',
            //replace: false,
            scope: {
                teacup: '='
            },
            controller: function ($scope) {
                $scope.calculaterating = function (teacup) {
                    if (!teacup)
                        return;
                    var ratingCount = 0;
                    var ratingSum = 0.0;
                    for (var i in teacup.comments) {
                        ratingCount++;
                        ratingSum += parseFloat(teacup.comments[i].rating);
                    }
                    if (ratingSum === 0)
                        return;
                    var rate = parseFloat(ratingSum / ratingCount);
                    var fullpart = Math.floor(rate);
                    $scope.teacuprating = [];
                    for (i = 1; i <= 5; i++) {
                        var partvalue = 0;
                        if (fullpart >= i) {
                            partvalue = 100;
                        }
                        else if (i === fullpart + 1) {
                            partvalue = (rate - fullpart) * 100;
                        }
                        $scope.teacuprating.push(partvalue);
                    }
                };
            },
            templateUrl: '/teacups/views/Directives/teacup-rating.html'
        };
    });

angular.module('mean.teacups')
.directive('star', function () {
    return {
        restrict: 'E',
        //replace: false,
        scope: {
            starpercent: '='
        },
        templateUrl: '/teacups/views/Directives/star.html'
    };
});

angular.module('mean.teacups')
.directive('teacupToogledescription', function () {
    return {
        restrict: 'E',
        //replace: false,
        scope: {
            text: '@text',
            limit: '@limit'
        },
        controller: function ($scope){
            $scope.limitedDescription = true;
            $scope.limitedTo = 250;
            $scope.limitDescription = function(islimited) {
                $scope.limitedDescription = islimited;               
            };
        },
        templateUrl: '/teacups/views/Directives/teacup-toogledescription.html'
    };
});