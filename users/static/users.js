euro2016App.controller('UsersListCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {

        var canceler = $q.defer();

        $scope.getUsers = function() {
            $http.get('/users/apiv1.0/users', {timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                $scope.users = data;
            });
        }

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });

        $scope.getUsers();

}]);

euro2016App.controller('UsersDetailCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {

        var canceler = $q.defer();
        $scope.getUserDetail = function() {
    //TODO : get user id and call REST API
            $http.get('/users/apiv1.0/users', {timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                $scope.users = data;
            });
        }

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });

        $scope.getUserDetail();

}]);
