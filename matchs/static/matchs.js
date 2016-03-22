euro2016App.controller('matchsCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {

        var canceler = $q.defer();

        $scope.getMatchs = function() {
            $http.get('matchs/apiv1.0/matchs', {timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                $scope.matchs = data.matchs;
            });
        }

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });

        //$scope.getMatchs();

}]);