var betApp = angular.module('betApp', []);


betApp.controller('BetsListCtrl', function ($scope, $http) {
        $http.get('apiv1.0/bets').success(function(data) {
        $scope.bets = data;
    });

  //$scope.orderProp = 'age';
});