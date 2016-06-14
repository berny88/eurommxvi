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
            $scope.displayBlogPostSaveButton = false;
            console.log("getMatchs::isConnected($window)="+isConnected($window));
            if (isAdmin($window)) {
                $scope.displayBlogPostSaveButton =true;
            }
        }

        $scope.saveMatchs = function() {
            console.log("getMatchs::$scope.no_save="+$scope.no_save);
            $http.put('matchs/apiv1.0/matchs', {matchs: $scope.matchs, no_save: $scope.no_save, timeout: canceler.promise})
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

        $scope.createHistoryRankings = function() {
            $('#spin_histo').show();
            $http.put('stats/apiv1.0/stats/historyrankings', {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $.notify("Historique des classements enregistrés !" , "success");
                $('#spin_histo').hide();
            })
            .error(function(data, status, headers, config) {
                if (status==403){
                    showAlertError("Même pas en rêve ! status=" + status+ " " + data);
                } else {
                    showAlertError("Erreur lors de l'enregistrement de l'historique des classements ; erreur HTTP : " + status);
                }
                $('#spin_histo').hide();
            })
        }

        // to avoid the cache of the images (avatars)
        d = new Date();
        $scope.currentDateForAvoidTheCache = d.getTime();

        $scope.getEmails = function() {
            $http.get('/users/apiv1.0/users?validated=true', {timeout: canceler.promise})
            .success(function(data) {
                $scope.users = data.users;

                tabEmails = [];
                for (var index = 0; index < $scope.users.length; ++index) {
                    user = $scope.users[index];
                    tabEmails.push(user.email);
                }
                $scope.listEmails = tabEmails.join(" ; ");

            });
        }

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });


}]);