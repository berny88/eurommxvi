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
            $scope.community.com_id = $routeParams.com_id;
            $scope.community.title = "Fake Title";
            $scope.community.description = "Fake description";
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            canceler.resolve();
        });

}]);