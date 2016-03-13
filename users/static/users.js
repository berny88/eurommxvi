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
        hideAlerts();
        $http.get('/users/apiv1.0/users/'+$routeParams.user_id, {timeout: canceler.promise})
        .success(function(data) {
            //ng-repeat :
            $scope.user = data.user;
            //alert($scope.user.email)
        });
    }

    $scope.$on('$destroy', function(){
        hideAlerts();
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
            if (status==403){
                showAlertError("Même pas en rêve ! status=" + status+ " " + data);
            }else if (status==401){
                showAlertError("Des problèmes de mémoire ? un Pirate en formation ? : status=" + status + " " + data);
            }else{
                showAlertError("Erreur lors de connexion ; erreur HTTP : " + status + " " + data);
            }
        });

    }


}]);

euro2016App.controller('LoginCtrl', ['$scope', '$http', '$q', '$routeParams', '$location','$timeout',
    function ($scope, $http, $q, $routeParams, $location, $timeout) {

        $scope.login = function(){
            connect={email:$scope.email, thepwd:$scope.thepwd};

            $http.post('/users/apiv1.0/login', {connect: connect, timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                hideAlerts();
                $scope.currentuser = data.user;
                $location.path("/communities")
                $timeout(function() {
                       showAlertSuccess("Bienvenue "+$scope.currentuser.nickName +" !!");
                    }, 1000);                //alert($scope.user.email)
            })
            .error(function(data, status, headers, config) {
                if (status==404){
                    showAlertError("Ben, tu veux allez en vrai ? : status=" + status);
                }else if (status==401){
                    showAlertError("Des problèmes de mémoire ? un Pirate en formation ? : status=" + status + " " + data);
                }else{
                    showAlertError("Erreur lors de connexion ; erreur HTTP : " + status + " " + data);
                }
            });

        }

        var canceler = $q.defer();

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });
}]);

