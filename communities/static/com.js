var comApp = angular.module('comApp', []);


comApp.controller('CommunitiesListCtrl', function ($scope, $http) {
  $http.get('apiv1.0/communities').success(function(data) {
    $scope.communities = data;
    alert(data);
  });

  //$scope.orderProp = 'age';
});