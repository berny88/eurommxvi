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

euro2016App.controller('UserDetailCtrl', ['$scope', '$http', '$q', '$routeParams', '$location', '$timeout', '$window',
    function ($scope, $http, $q, $routeParams, $location, $timeout, $window) {

    $scope.user = {};

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

    $scope.hasAuthorization = function() {
        var currentUser = {};
        if (isConnected($window)) {
            currentUser = getConnectedUser($window);
        }
        return currentUser.user_id == $scope.user.user_id ? true : false;
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

        $http.post('/users/apiv1.0/users/'+$routeParams.user_id, {user:$scope.user, timeout: canceler.promise})
        .success(function(data, status, headers, config) {
            $scope.user = data.user;
            $location.path("/users")
            $timeout(function() {
                showAlertSuccess("User [" + $scope.user.email + "] sauvegardé avec succès !");
            }, 1000);                //alert($scope.user.email)

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

euro2016App.controller('LoginCtrl', ['$scope', '$http', '$q', '$routeParams', '$location','$timeout', '$window',
    function ($scope, $http, $q, $routeParams, $location, $timeout, $window) {

        $scope.login = function(){
            connect={email:$scope.email, thepwd:$scope.thepwd};

            $http.post('/users/apiv1.0/login', {connect: connect, timeout: canceler.promise})
            .success(function(data) {
                hideAlerts();
                setConnectedUserInStorage($window, data.user)
                // Display the user in the topbar :
                $("#connectedUserInTopbar").html(data.user.nickName);
                $location.path("/communities")
                $timeout(function() {
                       showAlertSuccess("Bienvenue "+data.user.nickName +" !!");
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

euro2016App.controller('LogoutCtrl', ['$scope', '$http', '$q', '$location','$timeout', '$window',
    function ($scope, $http, $q, $location, $timeout, $window) {

        //alert("logout");
        //to remove the cookie from "session"
        if ($window.sessionStorage["currentUser"] != "null") {
            $scope.logout = function(){
                $http.post('/users/apiv1.0/logout', {})
                .success(function(data) {
                    hideAlerts();
                    setConnectedUserInStorage($window, null);
                    // Remove the user from the topbar :
                    $("#connectedUserInTopbar").html("Vous n'êtes pas connecté !");
                    $location.path("/")
                    $timeout(function() {
                           showAlertSuccess("Goog bye  !!");
                        }, 1000);
                })
                .error(function(data, status, headers, config) {
                    showAlertError("Erreur lors de connexion ; erreur HTTP : " + status + " " + data);
                });

            }

            $scope.logout();
        }

        var canceler = $q.defer();

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });
}]);
