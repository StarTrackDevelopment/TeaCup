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
            scope: {
                comments: '=comments'
            },
            controller: function ($scope) {
                $scope.totalItems = 64;
                $scope.currentPage = 4;

                $scope.setPage = function (pageNo) {
                    $scope.currentPage = pageNo;
                };

                $scope.pageChanged = function () {
                    console.log('Page changed to: ' + $scope.currentPage);
                };

                $scope.maxSize = 5;
                $scope.bigTotalItems = 175;
                $scope.bigCurrentPage = 1;
            },
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
    .directive('teacupRating', function () {
        return {
            restrict: 'E',
            //replace: false,
            scope: {
                teacup: '=teacup'
            },
            controller: function ($scope, $location, $anchorScroll) {
                $scope.htmlTooltip = 'n.a.';
                $scope.calculaterating = function (teacup) {
                    if (!teacup)
                        return;
                    var ratingCount = 0;
                    var ratingSum = 0.0;
                    $scope.ratingcounts = [];
                    for (var index = 0; index < 6; index++)
                        $scope.ratingcounts.push(0);
                    for (index in teacup.comments) {
                        ratingCount++;
                        ratingSum += parseFloat(teacup.comments[index].rating);
                        $scope.ratingcounts[teacup.comments[index].rating] += 1;
                    }
                    if (ratingSum === 0)
                        return;
                    $scope.rate = parseFloat(ratingSum / ratingCount);
                    var fullpart = Math.floor($scope.rate);
                    $scope.teacuprating = [];
                    for (index = 1; index <= 5; index++) {
                        var partvalue = 0;
                        if (fullpart >= index) {
                            partvalue = 100;
                        }
                        else if (index === fullpart + 1) {
                            partvalue = ($scope.rate - fullpart) * 100;
                        }
                        $scope.teacuprating.push(partvalue);
                    }
                    $scope.htmlTooltip = $scope.rate.toFixed(2);
                };
            },
            templateUrl: '/teacups/views/Directives/teacup-rating.html'
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

angular.module('mean.teacups')
.directive('teacupUserpicture', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            userid: '@userid'
        },
        template: '<i class="glyphicon glyphicon-user customgrey"></i>'
    };
});