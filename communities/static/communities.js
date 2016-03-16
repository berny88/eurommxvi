euro2016App.controller('CommunitiesCtrl', ['$scope', '$routeParams', '$http', '$q', '$location', '$timeout', '$window',
                            function ($scope, $routeParams, $http, $q, $location, $timeout, $window) {

        var canceler = $q.defer();

        $scope.sortType     = ''; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order

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

        $scope.updateCommunity = function() {
            hideAlerts();
            $scope.communityToUpdate = $scope.community.community;
            $http.put('communities/apiv1.0/communities', {communityToUpdate: $scope.communityToUpdate, timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $location.path("/communities")
                $timeout(function() {
                       showAlertSuccess("Communauté modifiée avec succès !!");
                    }, 1000);

            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la modification de la communauté ; erreur HTTP : " + status);
            });
        }

        $scope.createCommunity = function() {
            hideAlerts();
            $scope.communityToCreate.admin_user_id = getConnectedUser($window).user_id;
            $http.post('communities/apiv1.0/communities', {communityToCreate: $scope.communityToCreate, timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $location.path("/communities")
                $timeout(function() {
                       showAlertSuccess("Communauté créée avec succès !!");
                    }, 1000);

            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la création de la communauté ; erreur HTTP : " + status);
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

        // only the connected people can create/delete/modify a community
        $scope.isConnected = function() {
            // security.js :
            return isConnected($window);
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            hideAlerts();
            canceler.resolve();
        });

}]);