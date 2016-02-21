var comApp = angular.module('comApp', []);


comApp.controller('CommunitiesListCtrl', function ($scope, $http) {
        $http.get('apiv1.0/communities').success(function(data) {
        $scope.communities = data;
        $scope.phones = [
            {'name': 'Nexus S',
             'snippet': 'Fast just got faster with Nexus S.'},
            {'name': 'Motorola XOOM™ with Wi-Fi',
             'snippet': 'The Next, Next Generation tablet.'},
            {'name': 'MOTOROLA XOOM™',
             'snippet': 'The Next, Next Generation tablet.'}
          ];
    });

  //$scope.orderProp = 'age';
});