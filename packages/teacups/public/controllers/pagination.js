'use strict';

angular.module('mean.teacups')
    .controller('CustomPaginationController', [
        '$scope', function ($scope) {
            $scope.currentPage = 1;
            $scope.pageSize = 6;                        
        }
    ]);