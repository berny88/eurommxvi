euro2016App.controller('ChatCtrl', ['$scope', '$routeParams', '$http', '$q', '$location', '$timeout', '$window',
                            function ($scope, $routeParams, $http, $q, $location, $timeout, $window) {

        var canceler = $q.defer();

        hideAlerts();

        $scope.users = [
            {"user" : {message:"Bienvenue sur le mur !!", nickName:"Stefou", date:new Date() }},
            {"user" : {message:"Partie serveur non implémentée pour le moment :-(", nickName:"Berny", date:new Date() }}
        ]
        $('#userList').show();
        $('#inputText').focus();

        $scope.doPost = function() {

              var newUser = {"user" : {nickName:"Stefou"}}
              newUser.user.message = $('#inputText').val();
              newUser.user.date = new Date();
              $scope.users.push(newUser);

              $('#inputText').val('');
              $('#inputText').focus();

        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            hideAlerts();
            canceler.resolve();
        });

}]);