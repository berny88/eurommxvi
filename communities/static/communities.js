euro2016App.controller('CommunitiesCtrl', ['$scope', '$routeParams', '$http', '$q', function ($scope, $routeParams, $http, $q) {

        var canceler = $q.defer();

        $scope.community = {};
        $scope.communities = {};

        $scope.getCommunities = function() {
            $http.get('communities/apiv1.0/communities', {timeout: canceler.promise})
            .success(function(data) {
                $scope.communities = data;
            });
        }

        $scope.getCommunity = function() {
            // TODO : implémenter la recherche d'une communauté
            $scope.getCommunities();
            $scope.community = getCommunity($routeParams.com_id);
        }

        // get locally (ie in the scope, NOT remote) a community by its id
        function getCommunity(id) {
            for (var key in $scope.communities.communities) {
                var comm = $scope.communities.communities[key];
                if (comm.com_id === id) {
                    return comm
                }
            }
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            canceler.resolve();
        });

}]);