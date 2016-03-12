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
    //called to display le detail of user, when the page is displayed
    $scope.getUserDetail();


    //save the detail of User
    $scope.saveUser = function() {
        //alert(" nickname="+$scope.user.nickName)

        $http.patch('/users/apiv1.0/users/'+$routeParams.user_id, {user:$scope.user, timeout: canceler.promise})
        .success(function(data, status, headers, config) {
            $scope.user = data.user;
            showAlertSuccess("User [" + $scope.user.email + "] sauvegardé avec succès !");
        })
        .error(function(data, status, headers, config) {
            showAlertError("Erreur lors de la mise à jour ; erreur HTTP : " + status);
        });

    }


}]);

euro2016App.controller('LoginCtrl', ['$scope', '$http', '$q', '$routeParams', function ($scope, $http, $q, $routeParams) {

        $scope.login = function(){
            alert($scope.thepwd);
            $http.get('/users/apiv1.0/users/'+$routeParams.user_id, {timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                $scope.user = data.user;
                //alert($scope.user.email)
            });
        }

        var canceler = $q.defer();

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });
}]);

