'use strict';

angular.module('mean.teacups')
    .controller('CustomRatingController', [
        '$scope', function ($scope) {
            $scope.rate = 0;
            $scope.max = 5;
            $scope.isReadonly = false;
            $scope.ratetext = 'very displeased';
            $scope.overStar = 1;
            $scope.percent = 10;

            $scope.hoveringOver = function (value) {
                $scope.overStar = value;
                $scope.percent = 100 * ($scope.overStar / $scope.max);
                $scope.setRateText();
            };

            $scope.setRateText = function () {                
                if ($scope.percent < 21) {
                    $scope.ratetext = 'very displeased';
                } else if ($scope.percent < 41) {
                    $scope.ratetext = 'displeased';
                } else if ($scope.percent < 61) {
                    $scope.ratetext = 'neutral';
                } else if ($scope.percent < 81) {
                    $scope.ratetext = 'pleased';
                } else if ($scope.percent <= 100) {
                    $scope.ratetext = 'very pleased';
                }
            }

            $scope.getMaxRate = function (commentrate) {
                if (commentrate === 0)
                    return 1;
                else
                    return commentrate;
            };

            $scope.ratingStates = [
              { stateOn: 'icon-chevron-down', stateOff: 'glyphicon-ok-circle' },
              { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
              { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
              { stateOn: 'glyphicon-heart' },
              { stateOff: 'glyphicon-off' }
            ];
        }
    ]);