euro2016App.controller('statsMatchsCtrl', ['$scope', '$http', '$q', '$timeout', '$window', function ($scope, $http, $q, $timeout, $window) {

    console.log("buble_1 ******");

    var diameter = 960,
        format = d3.format(",d"),
        color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    console.log("select('buble_1')"+d3.select("buble_1"));
    var svg = d3.select("buble_1").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

        d3.json("/stats/apiv1.0/stats/teams", function(error, root) {
          if (error) throw error;

          var node = svg.selectAll(".node")
              .data(bubble.nodes(classes(root))
              .filter(function(d) { return !d.children; }))
            .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

          node.append("title")
              .text(function(d) { return d.className + ": " + format(d.value); });

          node.append("circle")
              .attr("r", function(d) { return d.r; })
              .style("fill", function(d) { console.log("d.packageName="+d.packageName+" color="+d.packageColor); return d.packageColor; });

          node.append("text")
              .attr("dy", ".3em")
              .style("text-anchor", "middle")
              .text(function(d) { return d.className.substring(0, d.r / 3); });
        });

        // Returns a flattened hierarchy containing all leaf nodes under the root.
        function classes(root) {
          console.log("root="+root.teams);
          var classes = [];

          function recurse(name, color, node) {
            if (node.children) {
                node.children.forEach(function(child) { recurse(node.name, node.color, child); });
            } else {
                console.log("name="+name+" node.name="+ node.name+" color="+color);
                //nb_goal+1 to be sure to have a buble
                classes.push({packageName: name, packageColor: color, className: node.name, value: node.nb_goal});
            }
          }

          recurse(null, null, root.teams);
          return {children: classes};
        }

        d3.select(self.frameElement).style("height", diameter + "px");


}]);

euro2016App.controller('statsRankingCtrl', ['$scope', '$http', '$q', '$routeParams','$filter', function ($scope, $http, $q, $routeParams,$filter) {

    var canceler = $q.defer();

    // to avoid the cache of the images (avatars)
    d = new Date();
    $scope.currentDateForAvoidTheCache = d.getTime();

    $scope.getRanking = function() {
        $http.get('/stats/apiv1.0/stats/ranking', {timeout: canceler.promise})
        .success(function(data) {
            $scope.rankings = data;
            $('#spin').hide();
        })
        .error(function(data, status, headers, config) {
            showAlertError("Erreur lors de la récupération du classement général ; erreur HTTP : " + status);
            $('#spin').hide();
        });
    }

$scope.getHistoryRanking = function() {

        var community_id = $routeParams.com_id;
        if (!$routeParams.com_id) {
            community_id = 'all'
        }
        $http.get('/stats/apiv1.0/stats/historyrankings?com_id='+community_id, {timeout: canceler.promise})
        .success(function(data) {
            $scope.historyrankings = data.data.historyrankings;
            dates = [];
            users_id =[];
            users_nickname =[];
            var mapHistoryRankings = {};
            for (var index = 0; index < $scope.historyrankings.length; ++index) {
                ranking = $scope.historyrankings[index];
                dates.push(ranking.date_ranking);
                users_id.push(ranking.user_id);
                users_nickname.push(ranking.user_nickname)
                mapHistoryRankings[ranking.date_ranking+'__'+ranking.user_id] = ranking;
            }

            // Prepare datas for the chart (unique values)
            var uniqueDates = [];
            $.each(dates, function(i, el){
                if($.inArray(el, uniqueDates) === -1) uniqueDates.push(el);
            });
            var uniqueUsers_id = [];
            $.each(users_id, function(i, el){
                if($.inArray(el, uniqueUsers_id) === -1) uniqueUsers_id.push(el);
            });
            var uniqueUsers_nickname = [];
            $.each(users_nickname, function(i, el){
                if($.inArray(el, uniqueUsers_nickname) === -1) uniqueUsers_nickname.push(el);
            });
            var series = [];
            for (var indexA = 0; indexA < uniqueUsers_id.length; ++indexA) {
                user_id = uniqueUsers_id[indexA];
                var serie = [];
                for (var indexB = 0; indexB < uniqueDates.length; ++indexB) {
                    date = uniqueDates[indexB];
                    key = date+'__'+user_id;
                    if (key in mapHistoryRankings) {
                        serie.push({meta:  mapHistoryRankings[key].user_nickname, value: mapHistoryRankings[key].nb_points});
                    } else {
                        serie.push(null);
                    }
                }
                series.push(serie);
            }

            // Display dates in a short format :
            var uniqueDates_shortFormat = [];
            for (var index = 0; index < uniqueDates.length; ++index) {
                dateFromDB = uniqueDates[index];
                uniqueDates_shortFormat.push($filter('date')(dateFromDB, "dd/MM"));
            }

            var data = {
              // A labels array that can contain any sort of values
              labels: uniqueDates_shortFormat,
              // Our series array
              series: series
            };

            var options = {
              lineSmooth: Chartist.Interpolation.cardinal({
                fillHoles: true,
               }),
               plugins: [
                    Chartist.plugins.legend({legendNames: uniqueUsers_nickname}),

                    Chartist.plugins.ctAxisTitle({
                          axisX: {
                            axisTitle: 'Dates',
                            axisClass: 'ct-axis-title',
                            offset: {
                              x: 0,
                              y: 35
                            },
                            textAnchor: 'middle'
                          },
                          axisY: {
                            axisTitle: 'Points',
                            axisClass: 'ct-axis-title',
                            offset: {
                              x: 0,
                              y: -5
                            },
                            textAnchor: 'middle',
                            flipTitle: false
                          }
                        }),

                    Chartist.plugins.tooltip()

                    ]
            }

            var responsiveOptions = [
              ['screen and (max-width: 640px)', {
                axisX: {
                  labelInterpolationFnc: function(value, index) {
                    if (uniqueDates.length > 4) {
                        return index % 10 === 0 ? value : null;
                    }
                  }
                }
              }],
              ['screen and (min-width: 640px)', {
                axisX: {
                  labelInterpolationFnc: function(value, index) {
                    if (uniqueDates.length > 15) {
                        return index % 3 === 0 ? value : null;
                    }
                  }
                }
              }]
            ];

            // Create a new line chart object where as first parameter we pass in a selector
            // that is resolving to our chart container element. The Second parameter
            // is the actual data object.

            if (uniqueDates_shortFormat.length > 0) {
                new Chartist.Line('.ct-chart', data, options, responsiveOptions);
            }
            $('#spin').hide();

        })
        .error(function(data, status, headers, config) {
            showAlertError("Erreur lors de la récupération de l'historique des classements ; erreur HTTP : " + status);
            $('#spin').hide();
        });

    }


    // Aborts the $http request if it isn't finished.
    $scope.$on('$destroy', function(){
        hideAlerts();
        canceler.resolve();
    });

}]);