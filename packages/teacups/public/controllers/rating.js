'use strict';

angular.module('mean.teacups')
    .controller('CustomRatingController', [
        '$scope', function ($scope) {
            $scope.isReadonly = false;
            $scope.ratetext = 'very displeased';
            $scope.rate = 1;
            $scope.max = 5;

            $scope.hoveringOver = function (value) {
                $scope.overStar = value;
                $scope.percent = 100 * ($scope.overStar / $scope.max);
                $scope.setRateText();
            };

            $scope.setRateText = function() {
                if ($scope.percent < 21) {
                    $scope.ratetext = 'disappointed';
                } else if ($scope.percent < 41) {
                    $scope.ratetext = 'displeased';
                } else if ($scope.percent < 61) {
                    $scope.ratetext = 'neutral';
                } else if ($scope.percent < 81) {
                    $scope.ratetext = 'pleased';
                } else if ($scope.percent <= 100) {
                    $scope.ratetext = 'very pleased';
                }
            };

            $scope.getMaxRate = function (commentrate) {
                if (commentrate === 0)
                    return 1;
                else
                    return commentrate;
            };
    }
    ]);