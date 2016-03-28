euro2016App.controller('matchsCtrl', ['$scope', '$http', '$q', '$timeout', '$window', function ($scope, $http, $q, $timeout, $window) {

        var canceler = $q.defer();

        $scope.getMatchs = function() {
            $http.get('matchs/apiv1.0/matchs', {timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                $scope.matchs = data.matchs;
                $scope.displaySaveButton = false;
                if (isConnected($window)) {
                    $scope.displaySaveButton = true;
                }
            });
        }

        $scope.saveMatchs = function() {
            $http.put('matchs/apiv1.0/matchs', {matchs: $scope.matchs, timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                //showAlertSuccess("Paris sauvegardés !");
                $.notify("Matchs sauvegardés !" , "success");
            })
            .error(function(data, status, headers, config) {
                if (status==403){
                    showAlertError("Même pas en rêve ! status=" + status+ " " + data);
                } else {
                    showAlertError("Erreur lors de la mise à jour des matchs ; erreur HTTP : " + status);
                }
            })
        }

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });

        //$scope.getMatchs();
        // to disable the input fields in the form



}]);