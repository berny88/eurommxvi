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
        return ((currentUser.user_id == $scope.user.user_id) || $routeParams.firstConnection || isAdmin($window)) ? true : false;
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
                if ($routeParams.firstConnection) {
                    showAlertSuccess("Bienvenue " + $scope.user.nickName + " ! Cliquez <a href='#/signin'>ici</a> pour vous identifier.");

                } else {
                    //showAlertSuccess("User [" + $scope.user.email + "] sauvegardé avec succès !");
                    $.notify("Parieur [" + $scope.user.nickName + "] sauvegardé avec succès !" , "success");
                }
            }, 1000);

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

euro2016App.controller('LoginCtrl', ['$scope', '$http', '$q', '$routeParams', '$location','$timeout', '$window', '$sce',
    function ($scope, $http, $q, $routeParams, $location, $timeout, $window, $sce) {

        $scope.login = function(){
            connect={email:$scope.email, thepwd:$scope.thepwd};

            $http.post('/users/apiv1.0/login', {connect: connect, timeout: canceler.promise})
            .success(function(data) {
                hideAlerts();
                setConnectedUserInStorage($window, data.user)
                // Display the user in the topbar :
                $("#connectedUserInTopbar").html(data.user.nickName);
                if ($routeParams.callback) {
                    $location.path("/" + $sce.trustAsResourceUrl($routeParams.callback))
                } else {
                    $location.path("/communities")
                }
                $location.search('callback', null)
                //$timeout(function() {
                //       showAlertSuccess("Bienvenue "+data.user.nickName +" !!");
                //   }, 1000);
                $.notify("Bienvenue "+data.user.nickName +" !!" , "success");
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

        $(function () {
            $('#email').focus();
        });

        var canceler = $q.defer();

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });
}]);

euro2016App.controller('LogoutCtrl', ['$scope', '$http', '$q', '$location','$timeout', '$window',
    function ($scope, $http, $q, $location, $timeout, $window) {

        //alert("logout");
        //to remove the cookie from "session"
        if (isConnected($window)) {
            $scope.logout = function(){
                $http.post('/users/apiv1.0/logout', {})
                .success(function(data) {
                    hideAlerts();
                    setConnectedUserInStorage($window, null);
                    // Remove the user from the topbar :
                    $("#connectedUserInTopbar").html("Vous n'êtes pas connecté !");
                    $location.path("/")
                    //$timeout(function() {
                    //       showAlertSuccess("Goog bye  !!");
                    //    }, 1000);
                    $.notify("Goog bye  !!" , "success");
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
