euro2016App.directive('customPopover', function ($http,$timeout) {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            el.bind('click', function(e) {

                    $http.get('bets/apiv1.0/bets/'+attrs.popoverKey+'/rates')
                    .success(function(data, status, headers, config) {

                        $(el).popover({
                            trigger: 'focus',
                            html:true,
                            title: 'Côte du match',
                            content: '<table><tr><td>Nombre de parieurs</td><td>: '+data.rates.nbBets +'</td></tr><tr><td>TeamA vainqueur</td><td>: '+data.rates.winnerAPercent+'%</td></tr>'+'<tr><td>Match nul</td><td>: '+data.rates.drawPercent+'%</td></tr>'+'<tr><td>TeamB vainqueur</td><td>: '+data.rates.winnerBPercent+'%</td></tr></table>',
                            placement: attrs.popoverPlacement});
                        $(el).popover('show');

                    })
                    .error(function(data, status, headers, config) {
                        showAlertError("Erreur lors de la récupération des statistiques ; erreur HTTP : " + status);
                    });
            })
        }
    };
});

euro2016App.controller('BetsCtrl', ['$scope', '$routeParams', '$http', '$q', '$location', '$timeout', '$window',
                            function ($scope, $routeParams, $http, $q, $location, $timeout, $window) {

        var canceler = $q.defer();

        // Jauge :
        var config = liquidFillGaugeDefaultSettings();
        config.circleThickness = 0.1;
        config.circleFillGap = 0.1;
        config.textVertPosition = 0.8;
        config.waveAnimateTime = 1000;
        config.waveHeight = 0.1;
        config.waveCount = 3;
        var gauge= loadLiquidFillGauge("fillgauge", 0, config);

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

                    $('#spin_bets').hide();

                    $scope.gaugeUpdate($scope.bets.bets)

                })
                .error(function(data, status, headers, config) {
                    showAlertError("Erreur lors de la récupération de la liste des paris ; erreur HTTP : " + status);
                    $('#spin_bets').hide();
                    gauge.update(0);
                });
            }

        }

        $scope.gaugeUpdate = function(bets) {
            $scope.nbBetsTot = 0;
            $scope.nbBetsUser = 0;
            bets.forEach(function(bet) {
                if ((bet.resultA != null) && (bet.resultB != null)) {
                    $scope.nbBetsUser = $scope.nbBetsUser + 1;
                }
                $scope.nbBetsTot = $scope.nbBetsTot +1;
            });

            $scope.gauge = Math.ceil($scope.nbBetsUser * 100 / $scope.nbBetsTot);
            gauge.update($scope.gauge);
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