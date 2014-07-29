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
            /*controller: function ($scope) {
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
            },*/
            templateUrl: '/teacups/views/Directives/teacup-comments.html'
        };
    });

angular.module('mean.teacups')
    .directive('teacupSubscribedusers', function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                subscribedusers: '=subscribedusers'
            },            
            templateUrl: '/teacups/views/Directives/teacup-subscribedusers.html'
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
        template: '<a data-ng-href="/#!/users/{{userid}}"><i class="glyphicon glyphicon-user customgrey"></i></a>'
    };
});

/*angular.module('mean.teacups')

    .filter('paginate', function (Paginator) {

        return function (input, rowsPerPage) {
            if (!input) {
                return input;
            }            

            if (rowsPerPage) {
                Paginator.rowsPerPage = rowsPerPage;
            }

            Paginator.itemCount = input.length;

            return input.slice(parseInt(Paginator.page * Paginator.rowsPerPage), parseInt((Paginator.page + 1) * Paginator.rowsPerPage + 1) - 1);
        };
    })

    .filter('forLoop', function () {
        return function (input, start, end) {
            input = new Array(end - start);
            for (var i = 0; start < end; start++, i++) {
                input[i] = start;
            }

            return input;
        };
    })

    .service('Paginator', function ($rootScope) {
        this.page = 0;
        this.rowsPerPage = 6;
        this.itemCount = 0;
        this.limitPerPage = 3;

        this.setPage = function (page) {
            if (page > this.pageCount()) {
                return;
            }

            this.page = page;
        };

        this.nextPage = function () {
            if (this.isLastPage()) {
                return;
            }

            this.page++;
        };

        this.perviousPage = function () {
            if (this.isFirstPage()) {
                return;
            }

            this.page--;
        };

        this.firstPage = function () {
            this.page = 0;
        };

        this.lastPage = function () {
            this.page = this.pageCount() - 1;
        };

        this.isFirstPage = function () {
            return this.page === 0;
        };

        this.isLastPage = function () {
            return this.page === this.pageCount() - 1;
        };

        this.pageCount = function () {
            return Math.ceil(parseInt(this.itemCount) / parseInt(this.rowsPerPage));
        };

        this.lowerLimit = function () {
            var low = this.page;
            low -= Math.ceil(this.limitPerPage/2);
            low -= 1;
            if (low < 0) {
                return 0;
            }
            var pagecountminuslimit = this.pageCount();
            pagecountminuslimit -= this.limitPerPage;
            if (pagecountminuslimit < 0) {
                return 0;
            }
            pagecountminuslimit += 1;
            if (this.page > pagecountminuslimit ) {
                return --pagecountminuslimit;
            }
            return low;
        };
    })

    .directive('paginator', function factory() {
        return {
            restrict: 'E',
            controller: function ($scope, Paginator) {
                $scope.paginator = Paginator;
            },
            templateUrl: '/teacups/views/Directives/pagination.html'
        };
    });*/