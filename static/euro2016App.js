// create the module and name it euro2016App
// also include ngRoute for all our routing needs
var euro2016App = angular.module('euro2016App', ['ngRoute', 'ngResource', 'ngAnimate']);

// To avoid HTML caching :
euro2016App.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });
});

// create the controller and inject Angular's $scope
euro2016App.controller('indexCtrl', function($scope) {
    $scope.message = 'EURO 2016';
    $scope.comment = 'Amazing bet site';
});

// create the controller and inject Angular's $scope
euro2016App.controller('topbarCtrl', function($scope, $window) {
    // security.js
    if (isConnected($window)) {
        $("#connectedUserInTopbar").html(getConnectedUser($window).nickName);
    } else {
        $("#connectedUserInTopbar").html("Vous n'êtes pas connectés !");
    }

    // to display the button "connexion" or "deconnexion" in the topbar
    $scope.isConnected = function() {
        // security.js :
        return isConnected($window);
    }
});