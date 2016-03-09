euro2016App.controller('CommunitiesCtrl', ['$scope', '$routeParams', '$http', '$q', function ($scope, $routeParams, $http, $q) {

        var canceler = $q.defer();

        $scope.community = {};
        $scope.communityToDelete = {};
        $scope.communities = {};

        $scope.getCommunities = function() {
            $http.get('communities/apiv1.0/communities', {timeout: canceler.promise})
            .success(function(data) {
                $scope.communities = data;
            });
        }

        $scope.getCommunity = function() {
            $http.get('communities/apiv1.0/communities/' + $routeParams.com_id, {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.community = data;
            });
        }

        $scope.deleteCommunity = function(communityToDelete) {
            $scope.communityToDelete = communityToDelete;
            showModal();
        }

        // launched when the "OK" button of the confirmation modal is pressed :
        $scope.confirm = function() {
            $http.delete('communities/apiv1.0/communities/' + $scope.communityToDelete.com_id, {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.communities = data;
                closeModal();
            })
            .error(function(data, status, headers, config) {
                closeModal();
                alert("Erreur :"+status)
            });
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            canceler.resolve();
        });

}]);