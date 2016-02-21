var comApp = angular.module('comApp', []);

comApp.controller('CommunitiesListCtrl', function ($scope) {
  $scope.communities = [
    {'title': 'ddddddddd',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.'}
  ];
});