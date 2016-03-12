// configure our routes
euro2016App.config(function($routeProvider) {

    $routeProvider

        // route for index
        .when('/accueil', { templateUrl:'static/accueil.html', controller:'indexCtrl' })
        .when('/', { templateUrl:'static/accueil.html', controller:'indexCtrl' })

        // to subscribe to the site
        .when('/signon', { templateUrl:'users/static/logon.html', controller:'indexCtrl' })

        // to subscribe to the site
        .when('/signin', { templateUrl:'users/static/signin.html', controller:'LoginCtrl' })

        // just page to confirm email sent
        .when('/logon_successfull', { templateUrl:'users/static/logon_successfull.html', controller:'indexCtrl' })

        // just page to confirm email sent
        .when('/user_detail/:user_id', { templateUrl:'users/static/user.html', controller:'UserDetailCtrl' })

        // route for list of users
        .when('/users', { templateUrl:'users/static/users.html', controller:'UsersListCtrl' })

        // route for communities
        .when('/communities', { templateUrl:'communities/static/communities.html', controller:'CommunitiesCtrl' })
        .when('/view_community/:com_id', { templateUrl:'communities/static/view_community.html', controller:'CommunitiesCtrl' })
        .when('/create_community', { templateUrl:'communities/static/create_community.html', controller:'CommunitiesCtrl' })
		
        // route for matchs page: "static page"
        .when('/matchs', { templateUrl:'matchs/static/matchs.html', controller:'matchsCtrl' })

        // route for rules of games and bets : "static page"
        .when('/rules', { templateUrl:'static/rules.html', controller:'indexCtrl' })

        // route for about page : "static page"
        .when('/about', { templateUrl:'static/about.html', controller:'indexCtrl' })

        // route for about page : "static page"
        .when('/contact', { templateUrl:'static/contact.html', controller:'indexCtrl' })

        // default
        .otherwise({ templateUrl:'static/accueil.html', controller:'indexCtrl' });
});