// configure our routes
euro2016App.config(function($routeProvider) {

    $routeProvider

        // route for index
        .when('/', { templateUrl:'static/accueil.html', controller:'indexCtrl' })

        // route for communities
        .when('/communities', { templateUrl:'communities/static/communities.html', controller:'CommunitiesCtrl' })
		
        // default
        .otherwise({ templateUrl:'static/accueil.html', controller:'indexCtrl' });
});