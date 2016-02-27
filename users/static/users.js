var comApp = angular.module('comApp', []);


comApp.controller('UsersListCtrl', function ($scope, $http) {
        $http.get('apiv1.0/users').success(function(data) {
        $scope.users = data;
    });

  //$scope.orderProp = 'age';
});