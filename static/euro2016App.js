// create the module and name it euro2016App
// also include ngRoute for all our routing needs
var euro2016App = angular.module('euro2016App', ['ngRoute', 'ngResource', 'ngAnimate']);

// create the controller and inject Angular's $scope
euro2016App.controller('indexCtrl', function($scope) {
    $scope.message = 'EURO 2016';
    $scope.comment = 'Amazing bet site';
});

