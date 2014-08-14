'use strict';

var app = angular.module('mean.teacups');

app.directive('commentChart', function ($window) {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            acomments: '@'
        },
        template: '<svg height=\'10\'></svg>',        
        link: function (scope, elem, attrs) {
            attrs.$observe('acomments', function (value) {
                if (!value || !value.length) return;

                var values = scope.$eval(value);

                var ratingcounts = [];
                for (var index = 0; index < 5; index++)
                    ratingcounts.push(0);
                for (index in values) {
                    if (values[index].rating > 0) {
                        ratingcounts[values[index].rating - 1] += 1;
                    }
                }
                var data = ratingcounts;
                
                var d3 = $window.d3;
                //var rawSvg = elem.find('svg');
                //var svg = d3.select(rawSvg[0]);

                var x = d3.scale.linear()
                .domain([0, d3.max(data)])
                .range([0, 100]);

                d3.select('.chart')
                    .selectAll('div')
                    .data(data)
                    .enter().append('div')
                    .style('width', function (d) { return x(d) + 'px'; })
                    //.style('width', function (d) { return d + '%'; })
                    .text(function (d) { return d; });
            });            
        }      
    };
});