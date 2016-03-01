var comApp = angular.module('comApp', ['ngTouch', 'ui.grid', 'ui.grid.edit']);


comApp.controller('CommunitiesListCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {

        // REMOTE DATAS :
        $scope.gridOptions = {
        };

        $scope.gridOptions.columnDefs = [
            {name:'id', displayName: 'Id Tech.', enableCellEdit: false, width: '20%' },
            {name:'title', displayName: 'Titre (editable)', width: '40%'},
            {name:'description', displayName: 'Description (editable)', width: '40%'}

        ];

        var canceler = $q.defer();

        $scope.getCommunities = function() {
            $http.get('apiv1.0/communities', {timeout: canceler.promise})
            .success(function(data) {
                //ng-repeat :
                $scope.communities = data;
                //ui-grid :
                $scope.gridOptions.data = data.communities;
            });
        }
        $scope.getCommunities();

        $scope.$on('$destroy', function(){
            canceler.resolve();  // Aborts the $http request if it isn't finished.
        });

        $scope.addData = function() {
            var n = $scope.gridOptions.data.length + 1;
            $scope.gridOptions.data.push({
                "id": n,
                "title": "Titre" + n,
                "description": "Desc " + n

            });
        };

        $scope.removeFirstRow = function() {
           $scope.gridOptions.data.splice(0,1);
        };

        $scope.reset = function () {
            $scope.getCommunities();
        }

}]);