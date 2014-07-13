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
            };

            $scope.getMaxRate = function (commentrate) {
                if (commentrate === 0)
                    return 1;
                else
                    return commentrate;
            };

            $scope.calculaterating = function (teacup) {
                if (!teacup)
                    return 0;
                var ratingCount = 0;
                var ratingSum = 0.0;
                for (var i in teacup.comments) {
                    ratingCount++;
                    ratingSum += parseFloat(teacup.comments[i].rating);
                }
                if (ratingSum === 0)
                    return 0;
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
                return rate;
            };
    }
    ]);