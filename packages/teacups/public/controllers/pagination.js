'use strict';

angular.module('mean.teacups')
    .controller('CustomPaginationController', [
        '$scope', 'Global', function ($scope, Global) {
            $scope.global = Global;

        $scope.filterObject = {
            speaker: '',
            title: ''
        };
        $scope.filterComment = {
            rating: ''
        };
        $scope.filterUser = {
            //_id: '',
            name: ''
        };
        $scope.currentPage = 1;
        $scope.pageSize = 6;
        $scope.hasPicture = function (user) {
            if (!user) return false;
            return user.pictureurl.length > 0;
        };            
    }
    ]);