var userApp = angular.module('userApp', []);


userApp.controller('UsersListCtrl', function ($scope, $http) {
        $http.get('/users/apiv1.0/users').success(function(data) {
        $scope.users = data;
    });

  //$scope.orderProp = 'age';
});

userApp.controller('UsersDetailCtrl', function ($scope, $http) {
        $http.get('/users/apiv1.0/users').success(function(data) {
        $scope.users = data;
    });
});
