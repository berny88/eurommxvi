euro2016App.controller('CommunitiesCtrl', ['$scope', '$routeParams', '$http', '$q', function ($scope, $routeParams, $http, $q) {

        var canceler = $q.defer();

        $scope.community = {};
        $scope.communityToDelete = {};
        $scope.communities = {};
        hideAlerts();

        $scope.getCommunities = function() {
            hideAlerts();
            $http.get('communities/apiv1.0/communities', {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.communities = data;
            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération de la liste des communautés ; erreur HTTP : " + status);
            });
        }

        $scope.getCommunity = function() {
            hideAlerts();
            $http.get('communities/apiv1.0/communities/' + $routeParams.com_id, {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.community = data;
            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération de la communauté ; erreur HTTP : " + status);
            });
        }

        $scope.deleteCommunity = function(communityToDelete) {
            $scope.communityToDelete = communityToDelete;
            showModal();
        }

        // launched when the "OK" button of the confirmation modal is pressed :
        $scope.confirm = function() {
            hideAlerts();
            $http.delete('communities/apiv1.0/communities/' + $scope.communityToDelete.com_id, {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.communities = data;
                closeModal();
                showAlertSuccess("Communauté [" + $scope.communityToDelete.title + "] supprimée avec succès !");
            })
            .error(function(data, status, headers, config) {
                closeModal();
                showAlertError("Erreur lors de la suppression de la communauté ; erreur HTTP : " + status);
            });
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            hideAlerts();
            canceler.resolve();
        });

}]);