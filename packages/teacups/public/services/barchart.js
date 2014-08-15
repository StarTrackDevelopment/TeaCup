'use strict';

var app = angular.module('mean.teacups');

app.directive('commentChart', function ($window) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            comments: '@'
        },
        controller: function ($scope) {
            $scope.d3 = $window.d3;
            //$scope.svg = 
            $scope.drawChart = function (values) {
                var ratingcounts = [];
                for (var index = 0; index < 5; index++)
                    ratingcounts.push(0);
                for (index in values) {
                    if (values[index].rating > 0) {
                        ratingcounts[5 - values[index].rating] += 1;
                    }
                }
                var data = ratingcounts;

                var d3 = $scope.d3;
                //var rawSvg = elem.find('svg');
                //var svg = d3.select(rawSvg[0]);
                //d3.select("svg").remove();                

                if (!$scope.chartelement) {
                    $scope.chartelement = d3.select('.chart');                    
                } else {
                    $scope.chartelement.selectAll('div').remove();
                }
                $scope.refresh(data);
            };
            $scope.refresh = function (data) {
                var d3 = $scope.d3;
                var x = d3.scale.linear()
                    .domain([0, d3.max(data)])
                    .range([0, 100]);
                $scope.chartelement
                    .datum(data)
                    .selectAll('div')
                    .data(data)
                    .enter().append('div')
                    .style('width', function (d) { return x(d) + 'px'; })
                    .style('opacity', 0.6)
                    //.style('width', function (d) { return d + '%'; })
                    .text(function (d) { return d; });

                // Update the y-scale.
                /*var yScale = d3.scale.linear();
                yScale
                    .domain(d3.extent(data.map(function (d) { return d[1]; })))
                    .range([5, 0])
                    .nice();
                // Horizontal grid
                $scope.chartelement
                  .selectAll('div')
                  //.insert('g', '.bars')
                  .insert('div')
                  .attr('class', 'grid horizontal')
                  .call(d3.svg.axis().scale(x)
                      .orient('left')
                      .tickSize(1,0)
                      .tickFormat('')
                  );*/

                /*var svg = d3.select('svg');
                var width = $window.getComputedStyle(svg[0][0])['.width'];
                width = parseFloat(width);
                var height = $window.getComputedStyle(svg[0][0])['.height'];
                height = parseFloat(height);
                var margin = 50;

                var scale = d3.scale.linear()
                    .domain([0, 1])
                    .range([0, 100]);

                var formatPercent = d3.format('.0%');

                var axis = d3.svg.axis()
                    .scale(scale)
                    .orient('right')
                    .ticks(1)
                    .tickFormat(formatPercent);

                svg.append('g')
                    .attr('class', 'y axis')
                    .attr('transform', 'translate(' + [0, 0]+')')
                    .call(axis);

                d3.selectAll('g.y.axis g.tick line')
                .attr('x2', function(d){
                    //d for the tick line is the value
                    //of that tick 
                    //(a number between 0 and 1, in this case)
                    if ( (10*d)%2 ) //if it's an even multiple of 10%
                        return 10;
                    else
                        return 4;
                });*/
            };
        },
        template: '<div class=\'chart\'></div>',
        link: function (scope, elem, attrs) {
            attrs.$observe('comments', function (value) {
                if (!value || !value.length) return;
                var values = scope.$eval(value);
                scope.drawChart(values);               
            });            
        }      
    };
});