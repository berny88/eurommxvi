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
            $http.get('communities/apiv1.0/communities/' + $routeParams.com_id, {timeout: canceler.promise})
            .success(function(data) {
                $scope.community = data;
            });
        }

        $scope.deleteCommunity = function(community) {
            $http.delete('communities/apiv1.0/communities/' + community.com_id, {timeout: canceler.promise})
            .success(function(data) {
                $scope.communities = data;
            });
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            canceler.resolve();
        });

}]);