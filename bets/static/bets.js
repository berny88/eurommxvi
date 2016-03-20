euro2016App.controller('BetsCtrl', ['$scope', '$routeParams', '$http', '$q', '$location', '$timeout', '$window',
                            function ($scope, $routeParams, $http, $q, $location, $timeout, $window) {

        var canceler = $q.defer();

        $scope.getBetsByCommunityId = function(com_id) {

            $scope.bets_old = {
                          "bets": [
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEA",
                              "description": "GROUPEA_FRA_ROU",
                              "key": "",
                              "libteamA": "FRANCE",
                              "libteamB": "ROUMANIE",
                              "resultA": 5,
                              "resultB": 4,
                              "teamA": "FRA",
                              "teamB": "ROU",
                              "dateDeadLineBet" : "2016-03-18T12:00Z",
                              "dateMatch" : "2016-06-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEA",
                              "description": "GROUPEA_ALB_SWI",
                              "key": "",
                              "libteamA": "ALBANIE",
                              "libteamB": "SUISSE",
                              "resultA": 9,
                              "resultB": 2,
                              "teamA": "ALB",
                              "teamB": "SWI",
                              "dateDeadLineBet" : "2016-03-18T12:00Z",
                              "dateMatch" : "2016-06-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEB",
                              "description": "GROUPEB_WAL_SLO",
                              "key": "",
                              "libteamA": "PAYS DE GALLES",
                              "libteamB": "SLOVAQUIE",
                              "resultA": 8,
                              "resultB": 3,
                              "teamA": "WAL",
                              "teamB": "SLO",
                              "dateDeadLineBet" : "2016-06-18T12:00Z",
                              "dateMatch" : "2016-06-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEB",
                              "description": "GROUPEB_ENG_RUS",
                              "key": "",
                              "libteamA": "ANGLETERRE",
                              "libteamB": "RUSSIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ENG",
                              "teamB": "RUS",
                              "dateDeadLineBet" : "2016-06-20T12:00Z",
                              "dateMatch" : "2016-06-20T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPED",
                              "description": "GROUPED_TUR_CRO",
                              "key": "",
                              "libteamA": "TURQUIE",
                              "libteamB": "CROATIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "TUR",
                              "teamB": "CRO",
                              "dateDeadLineBet" : "2016-06-20T12:00Z",
                              "dateMatch" : "2016-06-20T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEC",
                              "description": "GROUPEC_POL_IRN",
                              "key": "",
                              "libteamA": "POLOGNE",
                              "libteamB": "IRLANDE DU NORD",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "POL",
                              "teamB": "IRN",
                              "dateDeadLineBet" : "2016-06-20T12:00Z",
                              "dateMatch" : "2016-06-20T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEC",
                              "description": "GROUPEC_ALL_UKR",
                              "key": "",
                              "libteamA": "ALLEMAGNE",
                              "libteamB": "UKRAINE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ALL",
                              "teamB": "UKR",
                              "dateDeadLineBet" : "2016-06-20T12:00Z",
                              "dateMatch" : "2016-06-20T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPED",
                              "description": "GROUPED_ESP_TCQ",
                              "key": "",
                              "libteamA": "ESPAGNE",
                              "libteamB": "REP TCHEQUE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ESP",
                              "teamB": "TCQ",
                              "dateDeadLineBet" : "2016-06-20T12:00Z",
                              "dateMatch" : "2016-06-20T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEE",
                              "description": "GROUPEE_IRL_SWE",
                              "key": "",
                              "libteamA": "IRLANDE",
                              "libteamB": "SUEDE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "IRL",
                              "teamB": "SWE",
                              "dateDeadLineBet" : "2016-06-28T12:00Z",
                              "dateMatch" : "2016-06-28T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEE",
                              "description": "GROUPEE_BEL_ITA",
                              "key": "",
                              "libteamA": "BELGIQUE",
                              "libteamB": "ITALIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "BEL",
                              "teamB": "ITA",
                              "dateDeadLineBet" : "2016-06-28T12:00Z",
                              "dateMatch" : "2016-06-28T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEF",
                              "description": "GROUPEF_AUT_HON",
                              "key": "",
                              "libteamA": "AUTRICHE",
                              "libteamB": "HONGRIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "AUT",
                              "teamB": "HON",
                              "dateDeadLineBet" : "2016-06-28T12:00Z",
                              "dateMatch" : "2016-06-28T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEF",
                              "description": "GROUPEF_POR_ISL",
                              "key": "",
                              "libteamA": "PORTUGAL",
                              "libteamB": "ISLANDE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "POR",
                              "teamB": "ISL",
                              "dateDeadLineBet" : "2016-06-28T12:00Z",
                              "dateMatch" : "2016-06-28T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEB",
                              "description": "GROUPEB_RUS_SLO",
                              "key": "",
                              "libteamA": "RUSSIE",
                              "libteamB": "SLOVAQUIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "RUS",
                              "teamB": "SLO",
                              "dateDeadLineBet" : "2016-06-28T12:00Z",
                              "dateMatch" : "2016-06-28T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEA",
                              "description": "GROUPEA_ROU_SWI",
                              "key": "",
                              "libteamA": "ROUMANIE",
                              "libteamB": "SUISSE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ROU",
                              "teamB": "SWI",
                              "dateDeadLineBet" : "2016-07-05T12:00Z",
                              "dateMatch" : "2016-07-05T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEA",
                              "description": "GROUPEA_FRA_ALB",
                              "key": "",
                              "libteamA": "FRANCE",
                              "libteamB": "ALBANIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "FRA",
                              "teamB": "ALB",
                              "dateDeadLineBet" : "2016-07-05T12:00Z",
                              "dateMatch" : "2016-07-05T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEB",
                              "description": "GROUPEB_ENG_WAL",
                              "key": "",
                              "libteamA": "ANGLETERRE",
                              "libteamB": "PAYS DE GALLES",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ENG",
                              "teamB": "WAL",
                              "dateDeadLineBet" : "2016-07-05T12:00Z",
                              "dateMatch" : "2016-07-05T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEC",
                              "description": "GROUPEC_UKR_IRN",
                              "key": "",
                              "libteamA": "UKRAINE",
                              "libteamB": "IRLANDE DU NORD",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "UKR",
                              "teamB": "IRN",
                              "dateDeadLineBet" : "2016-07-05T12:00Z",
                              "dateMatch" : "2016-07-05T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEC",
                              "description": "GROUPEC_ALL_POL",
                              "key": "",
                              "libteamA": "ALLEMAGNE",
                              "libteamB": "POLOGNE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ALL",
                              "teamB": "POL",
                              "dateDeadLineBet" : "2016-07-10T12:00Z",
                              "dateMatch" : "2016-07-10T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEE",
                              "description": "GROUPEE_ITA_SWE",
                              "key": "",
                              "libteamA": "ITALIE",
                              "libteamB": "SUEDE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ITA",
                              "teamB": "SWE",
                              "dateDeadLineBet" : "2016-07-10T12:00Z",
                              "dateMatch" : "2016-07-10T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPED",
                              "description": "GROUPED_TCQ_CRO",
                              "key": "",
                              "libteamA": "REP TCHEQUE",
                              "libteamB": "CROATIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "TCQ",
                              "teamB": "CRO",
                              "dateDeadLineBet" : "2016-07-10T12:00Z",
                              "dateMatch" : "2016-07-10T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPED",
                              "description": "GROUPED_ESP_TUR",
                              "key": "",
                              "libteamA": "ESPAGNE",
                              "libteamB": "TURQUIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ESP",
                              "teamB": "TUR",
                              "dateDeadLineBet" : "2016-07-10T12:00Z",
                              "dateMatch" : "2016-07-10T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEE",
                              "description": "GROUPEE_BEL_IRL",
                              "key": "",
                              "libteamA": "BELGIQUE",
                              "libteamB": "IRLANDE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "BEL",
                              "teamB": "IRL",
                              "dateDeadLineBet" : "2016-07-10T12:00Z",
                              "dateMatch" : "2016-07-10T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEF",
                              "description": "GROUPEF_ISL_HON",
                              "key": "",
                              "libteamA": "ISLANDE",
                              "libteamB": "HONGRIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ISL",
                              "teamB": "HON",
                              "dateDeadLineBet" : "2016-07-18T12:00Z",
                              "dateMatch" : "2016-07-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEF",
                              "description": "GROUPEF_POR_AUT",
                              "key": "",
                              "libteamA": "ISLANDE",
                              "libteamB": "HONGRIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "POR",
                              "teamB": "AUT",
                              "dateDeadLineBet" : "2016-07-18T12:00Z",
                              "dateMatch" : "2016-07-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEA",
                              "description": "GROUPEA_ROU_ALB",
                              "key": "",
                              "libteamA": "ROUMANIE",
                              "libteamB": "ALBANIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ROU",
                              "teamB": "ALB",
                              "dateDeadLineBet" : "2016-07-18T12:00Z",
                              "dateMatch" : "2016-07-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEA",
                              "description": "GROUPEA_FRA_SWI",
                              "key": "",
                              "libteamA": "FRANCE",
                              "libteamB": "SUISSE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "FRA",
                              "teamB": "SWI",
                              "dateDeadLineBet" : "2016-07-18T12:00Z",
                              "dateMatch" : "2016-07-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEB",
                              "description": "GROUPEB_RUS_WAL",
                              "key": "",
                              "libteamA": "RUSSIE",
                              "libteamB": "PAYS DE GALLES",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "RUS",
                              "teamB": "WAL",
                              "dateDeadLineBet" : "2016-07-18T12:00Z",
                              "dateMatch" : "2016-07-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEB",
                              "description": "GROUPEB_SLO_ENG",
                              "key": "",
                              "libteamA": "ANGLETERRE",
                              "libteamB": "SLOVAQUIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ENG",
                              "teamB": "SLO",
                              "dateDeadLineBet" : "2016-07-18T12:00Z",
                              "dateMatch" : "2016-07-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPED",
                              "description": "GROUPED_TCQ_TUR",
                              "key": "",
                              "libteamA": "REP TCHEQUE",
                              "libteamB": "TURQUIE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "TCQ",
                              "teamB": "TUR",
                              "dateDeadLineBet" : "2016-07-18T12:00Z",
                              "dateMatch" : "2016-07-18T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPED",
                              "description": "GROUPED_CRO_ESP",
                              "key": "",
                              "libteamA": "CROATIE",
                              "libteamB": "ESPAGNE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "CRO",
                              "teamB": "ESP",
                              "dateDeadLineBet" : "2016-07-22T12:00Z",
                              "dateMatch" : "2016-07-22T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEF",
                              "description": "GROUPEF_ISL_AUT",
                              "key": "",
                              "libteamA": "ISLANDE",
                              "libteamB": "AUTRICHE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ISL",
                              "teamB": "AUT",
                              "dateDeadLineBet" : "2016-07-22T12:00Z",
                              "dateMatch" : "2016-07-22T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEF",
                              "description": "GROUPEF_HON_POR",
                              "key": "",
                              "libteamA": "HONGRIE",
                              "libteamB": "PORTUGAL",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "HON",
                              "teamB": "POR",
                              "dateDeadLineBet" : "2016-07-22T12:00Z",
                              "dateMatch" : "2016-07-22T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEE",
                              "description": "GROUPEE_ITA_AUT",
                              "key": "",
                              "libteamA": "ITALIE",
                              "libteamB": "AUTRICHE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "ITA",
                              "teamB": "AUT",
                              "dateDeadLineBet" : "2016-07-22T12:00Z",
                              "dateMatch" : "2016-07-22T18:45Z"
                            },
                            {
                              "category": "GROUPE",
                              "categoryName": "GROUPEE",
                              "description": "GROUPEE_SWE_BEL",
                              "key": "",
                              "libteamA": "SUEDE",
                              "libteamB": "BELGIQUE",
                              "resultA": "",
                              "resultB": "",
                              "teamA": "SWE",
                              "teamB": "BEL",
                              "dateDeadLineBet" : "2016-07-22T12:00Z",
                              "dateMatch" : "2016-07-22T18:45Z"
                            }
                          ]
                        }

            $scope.bets = {};

            hideAlerts();

            $http.get('communities/apiv1.0/communities/'+ com_id + '/users/'+ getConnectedUser($window).user_id +'/bets ', {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.bets = data;

                // to disable the input fields in the form
                $scope.bets.bets.forEach(function(bet) {
                    if (Date.parse(bet.dateDeadLineBet) > new Date()) {
                        bet.notClosed = true;
                    } else {
                        bet.notClosed = false;
                    }
                });

            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération de la liste des paris ; erreur HTTP : " + status);
            });

        }

        $scope.saveBets = function() {
            alert($scope.bets);
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            hideAlerts();
            canceler.resolve();
        });

}]);