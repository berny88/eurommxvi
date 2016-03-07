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

        //$scope.getUsers();

}]);

euro2016App.controller('UserDetailCtrl', ['$scope', '$http', '$q', '$routeParams', function ($scope, $http, $q, $routeParams) {

        var canceler = $q.defer();
        $scope.getUserDetail = function() {
            $http.get('/users/apiv1.0/users/'+$routeParams.user_id, {timeout: canceler.promise})
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
