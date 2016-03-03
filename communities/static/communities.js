euro2016App.controller('CommunitiesCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {

        var canceler = $q.defer();

        $scope.getCommunities = function() {
            $http.get('communities/apiv1.0/communities', {timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                $scope.communities = data;
            });
        }

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });

        $scope.getCommunities();

}]);