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

euro2016App.controller('statsRankingCtrl', ['$scope', function ($scope) {

}]);