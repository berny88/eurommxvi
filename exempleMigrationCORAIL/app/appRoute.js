// configure our routes
myApp.config(function($routeProvider) {

    $routeProvider
        // route for index
        .when('/', { templateUrl:'templates/index.html', controller:'indexCtrl' })
        // route for parametre
        .when('/parametres', { templateUrl:'templates/parametre/list_parametre.html', controller:'parametreCtrl' })
        .when('/new_parametre', { templateUrl:'templates/parametre/new_parametre.html', controller:'parametreCtrl' })
        .when('/view_parametre/:id', { templateUrl:'templates/parametre/view_parametre.html', controller:'parametreCtrl' })
        .when('/edit_parametre/:id', { templateUrl:'templates/parametre/edit_parametre.html', controller:'parametreCtrl' })
        .when('/del_parametre/:id', { templateUrl:'templates/parametre/del_parametre.html', controller:'parametreCtrl' })
        // route for produit
        .when('/produits', { templateUrl:'templates/produit/list_produit.html', controller:'produitCtrl' })
        .when('/new_produit', { templateUrl:'templates/produit/new_produit.html', controller:'produitCtrl' })
        .when('/view_produit/:id', { templateUrl:'templates/produit/view_produit.html', controller:'produitCtrl' })
        .when('/edit_produit/:id', { templateUrl:'templates/produit/edit_produit.html', controller:'produitCtrl' })
        .when('/del_produit/:id', { templateUrl:'templates/produit/del_produit.html', controller:'produitCtrl' })
        .when('/import_produit', { templateUrl:'templates/produit/imp_produit.html', controller:'produitCtrl' })        
        // route for stock_sens2
        .when('/stocks_sens2', { templateUrl:'templates/stock_sens2/list_stock_sens2.html', controller:'stockSens2Ctrl' })
        .when('/import_stock_sens2', { templateUrl:'templates/stock_sens2/imp_stock_sens2.html', controller:'stockSens2Ctrl' })        
        // route for stock_comp_produit_sens2
        .when('/stocks_comp_produit_sens2', { templateUrl:'templates/stock_comp_produit_sens2/list_stock_comp_produit_sens2.html', controller:'stockCompProduitSens2Ctrl' })
        // route for avrtd_pegase
        .when('/avrtds_pegase', { templateUrl:'templates/avrtd_pegase/list_avrtd_pegase.html', controller:'avrtdPegaseCtrl' })
        .when('/import_avrtd_pegase', { templateUrl:'templates/avrtd_pegase/imp_avrtd_pegase.html', controller:'avrtdPegaseCtrl' })
        // route for avrtd_comp_produit_pegase
        .when('/avrtds_comp_produit_pegase', { templateUrl:'templates/avrtd_comp_produit_pegase/list_avrtd_comp_produit_pegase.html', controller:'avrtdCompProduitPegaseCtrl' })
        // route for aviexp_comedi
        .when('/aviexps_comedi', { templateUrl:'templates/aviexp_comedi/list_aviexp_comedi.html', controller:'aviexpComediCtrl' })
        .when('/import_aviexp_comedi', { templateUrl:'templates/aviexp_comedi/imp_aviexp_comedi.html', controller:'aviexpComediCtrl' })        
        // route for aviexp_maestro
        .when('/aviexps_maestro', { templateUrl:'templates/aviexp_maestro/list_aviexp_maestro.html', controller:'aviexpMaestroCtrl' })
        .when('/import_aviexp_maestro', { templateUrl:'templates/aviexp_maestro/imp_aviexp_maestro.html', controller:'aviexpMaestroCtrl' })        
        // route for aviexp_converter
        .when('/aviexps_converter', { templateUrl:'templates/aviexp_converter/imp_aviexp_converter.html', controller:'aviexpConverterCtrl' })        
        // route for mvtcrl_maestro
        .when('/mvtcrls_maestro', { templateUrl:'templates/mvtcrl_maestro/list_mvtcrl_maestro.html', controller:'mvtcrlMaestroCtrl' })
        .when('/import_mvtcrl_maestro', { templateUrl:'templates/mvtcrl_maestro/imp_mvtcrl_maestro.html', controller:'mvtcrlMaestroCtrl' })        
        // route for alerte_maestro
        .when('/alertes_maestro', { templateUrl:'templates/alerte_maestro/list_alerte_maestro.html', controller:'alerteMaestroCtrl' })
        .when('/new_alerte_maestro', { templateUrl:'templates/alerte_maestro/new_alerte_maestro.html', controller:'alerteMaestroCtrl' })
        .when('/view_alerte_maestro/:id', { templateUrl:'templates/alerte_maestro/view_alerte_maestro.html', controller:'alerteMaestroCtrl' })
        .when('/edit_alerte_maestro/:id', { templateUrl:'templates/alerte_maestro/edit_alerte_maestro.html', controller:'alerteMaestroCtrl' })
        .when('/del_alerte_maestro/:id', { templateUrl:'templates/alerte_maestro/del_alerte_maestro.html', controller:'alerteMaestroCtrl' })
        .when('/import_alerte_maestro', { templateUrl:'templates/alerte_maestro/imp_alerte_maestro.html', controller:'alerteMaestroCtrl' })
        // route for alerte_corail
        .when('/alertes_corail', { templateUrl:'templates/alerte_corail/list_alerte_corail.html', controller:'alerteCorailCtrl' })
        .when('/new_alerte_corail', { templateUrl:'templates/alerte_corail/new_alerte_corail.html', controller:'alerteCorailCtrl' })
        .when('/view_alerte_corail/:id', { templateUrl:'templates/alerte_corail/view_alerte_corail.html', controller:'alerteCorailCtrl' })
        .when('/edit_alerte_corail/:id', { templateUrl:'templates/alerte_corail/edit_alerte_corail.html', controller:'alerteCorailCtrl' })
        .when('/del_alerte_corail/:id', { templateUrl:'templates/alerte_corail/del_alerte_corail.html', controller:'alerteCorailCtrl' })
        .when('/import_alerte_corail', { templateUrl:'templates/alerte_corail/imp_alerte_corail.html', controller:'alerteCorailCtrl' })
		// route for comp_maestro_corail
        .when('/alertes_comp_maestro_corail', { templateUrl:'templates/alerte_comp_maestro_corail/list_alerte_comp_maestro_corail.html', controller:'alerteCompMaestroCorailCtrl' })
		// route for comp_corail_maestro
        .when('/alertes_comp_corail_maestro', { templateUrl:'templates/alerte_comp_corail_maestro/list_alerte_comp_corail_maestro.html', controller:'alerteCompCorailMaestroCtrl' })
		// route for order
		.when('/ordre_hermes_alto', { templateUrl:'templates/ordre_hermes_alto/view_ordre.html', controller:'ordreHermesAltoCtrl' })
		.when('/import_ordre_hermes_alto', { templateUrl:'templates/ordre_hermes_alto/import_ordre.html', controller:'ordreHermesAltoCtrl' })
		
		
        // default
        .otherwise({ templateUrl:'templates/index.html', controller:'indexCtrl' });     
});