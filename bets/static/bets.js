euro2016App.controller('BetsCtrl', ['$scope', '$routeParams', '$http', '$q', '$location', '$timeout', '$window',
                            function ($scope, $routeParams, $http, $q, $location, $timeout, $window) {

        var canceler = $q.defer();

        $scope.getBetsByCommunityId = function() {

            $scope.bets = {};

            hideAlerts();

            if (isConnected($window)) {
                //$http.get('communities/apiv1.0/communities/'+ com_id + '/users/'+ getConnectedUser($window).user_id +'/bets ', {timeout: canceler.promise})
                $http.get('communities/apiv1.0/communities/'+ $routeParams.com_id + '/users/'+ getConnectedUser($window).user_id +'/bets ', {timeout: canceler.promise})
                .success(function(data, status, headers, config) {
                    $scope.bets = data;

                    // to disable the input fields in the form
                    $scope.displaySaveButton = false;
                    $scope.bets.bets.forEach(function(bet) {
                        if (Date.parse(bet.dateDeadLineBet) > new Date()) {
                            bet.notClosed = true;
                            $scope.displaySaveButton = true;
                        } else {
                            bet.notClosed = false;
                        }
                    });

                })
                .error(function(data, status, headers, config) {
                    showAlertError("Erreur lors de la récupération de la liste des paris ; erreur HTTP : " + status);
                });
            }

        }

        $scope.saveBets = function() {
            $http.put('communities/apiv1.0/communities/'+ $routeParams.com_id + '/users/'+ getConnectedUser($window).user_id +'/bets ', {bets: $scope.bets.bets, timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                //showAlertSuccess("Paris sauvegardés !");
                $.notify("Paris sauvegardés !" , "success");
            })
            .error(function(data, status, headers, config) {
                if (status==403){
                    showAlertError("Même pas en rêve ! status=" + status+ " " + data);
                } else {
                    showAlertError("Erreur lors de la création des paris ; erreur HTTP : " + status);
                }
            })
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            hideAlerts();
            canceler.resolve();
        });

}]);