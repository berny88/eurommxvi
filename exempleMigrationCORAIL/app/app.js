// create the module and name it myApp
// also include ngRoute for all our routing needs
var myApp = angular.module('myApp', ['ngRoute', 'ngResource', 'ur.file',  'ngAnimate', 'ui.bootstrap']);

// create the controller and inject Angular's $scope
myApp.controller('indexCtrl', function($scope) {
    // create a message to display in our view
    $scope.heading = 'Contrôle de la migration';
    $scope.message = '';
});
