'use strict';

angular.module('mean.teacups')
    .controller('CustomPaginationController', [
        '$scope', function ($scope) {
            $scope.filterObject = {
                speaker: '',
                title: ''
            };
            $scope.currentPage = 1;
            $scope.pageSize = 6;
    }
    ]);