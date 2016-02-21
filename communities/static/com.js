var comApp = angular.module('comApp', []);


comApp.controller('CommunitiesListCtrl', function ($scope, $http) {
  $http.get('apiv1.0/tasks').success(function(data) {
    $scope.tasks = data;
  });

  //$scope.orderProp = 'age';
});