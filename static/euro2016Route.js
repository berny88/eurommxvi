// configure our routes
euro2016App.config(function($routeProvider) {

    $routeProvider

        // route for index
        .when('/accueil', { templateUrl:'static/accueil.html', controller:'indexCtrl' })
        .when('/', { templateUrl:'static/accueil.html', controller:'indexCtrl' })

        //subscription process
        // to subscribe to the site
        .when('/signon', { templateUrl:'users/static/logon.html', controller:'indexCtrl' })
        // just page to confirm email sent
        .when('/logon_successfull', { templateUrl:'users/static/logon_successfull.html', controller:'indexCtrl' })

        // route for list of users
        .when('/users', { templateUrl:'users/static/users.html', controller:'UsersListCtrl' })
        // user page modification
        .when('/user_detail/:user_id', { templateUrl:'users/static/user.html', controller:'UserDetailCtrl' })

        // to sign in
        .when('/signin', { templateUrl:'users/static/signin.html', controller:'LoginCtrl' })
        // to logout
        .when('/logout', { templateUrl:'users/static/logout.html', controller:'LogoutCtrl' })

        // route for communities
        .when('/communities', { templateUrl:'communities/static/communities.html', controller:'CommunitiesCtrl' })
        .when('/view_community/:com_id', { templateUrl:'communities/static/view_community.html', controller:'CommunitiesCtrl' })
        .when('/create_community', { templateUrl:'communities/static/create_community.html', controller:'CommunitiesCtrl' })
        .when('/update_community/:com_id', { templateUrl:'communities/static/update_community.html', controller:'CommunitiesCtrl' })
		.when('/bet_in_community/:com_id', { templateUrl:'communities/static/bet_in_community.html', controller:'CommunitiesCtrl' })

        // route for matchs page: "static page"
        .when('/matchs', { templateUrl:'matchs/static/matchs.html', controller:'matchsCtrl' })
        .when('/admin_matchs', { templateUrl:'matchs/static/admin_matchs.html', controller:'matchsCtrl' })

        // route for tirage: "static page"
        .when('/tirage', { templateUrl:'static/tirage.html', controller:'tirageCtrl' })

        // route for calendrier: "static page"
        .when('/calendrier', { templateUrl:'static/calendrier.html', controller:'calendrierCtrl' })

        // route for rules of games and bets : "static page"
        .when('/rules', { templateUrl:'static/rules.html', controller:'indexCtrl' })

        // route for about page : "static page"
        .when('/about', { templateUrl:'static/about.html', controller:'indexCtrl' })

        // route for about page : "static page"
        .when('/contact', { templateUrl:'static/contact.html', controller:'indexCtrl' })

        // default
        .otherwise({ templateUrl:'static/accueil.html', controller:'indexCtrl' });
});