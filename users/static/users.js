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

euro2016App.controller('UserDetailCtrl', ['$scope', '$http', '$q', '$location', function ($scope, $http, $q, $location) {

        var canceler = $q.defer();
        $scope.getUserDetail = function() {
        //$location.search().uuid
    //TODO : get user id and call REST API
            $http.get('/users/apiv1.0/users/'+$location.search().uuid, {timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                $scope.user = data.user;
                //alert($scope.user.email)
            });
        }

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });

        $scope.getUserDetail();

}]);
