// aviexp_comedi factory
myApp.factory('AviexpComediFactory', function ($resource) {
	return $resource('services/aviexp_comedi/aviexp_comedi/:id', {id: '@id'}, {
		update:{ method:'PUT' },
		log:{ method:'LOG' },
		log_import:{ method:'LOG_IMPORT' }
	});
});
// aviexp_comedi controller
myApp.controller('aviexpComediCtrl', function($scope, $http, $routeParams, $location, $resource, AviexpComediFactory) {
	
    $scope.isSomethingLoading = 0;
	
    $scope.get_aviexps_comedi = function($resource) {
		$scope.aviexps_comedi = AviexpComediFactory.query();    
	}
	angular.extend($scope, {
		model: { file: null },
		upload: function(model) {
			$scope.isSomethingLoading = 1;
			$resource('services/aviexp_comedi/files/:id', { id: "@id" })
			.prototype.$save.call(model.file, function(self, headers) {
				$location.path("/aviexps_comedi");
			});
		}
	});  
	$scope.get_aviexp_comedi_log = function($resource) {
		$scope.log = AviexpComediFactory.log();  
	}
	$scope.get_aviexp_comedi_import_log = function($resource) {
		$scope.log_import = AviexpComediFactory.log_import();  
	}
    $scope.export_aviexp_comedi = function () {
        colDelim = '";"';
        rowDelim = '"\r\n"';
        csv='"ID'+colDelim+'BL'+colDelim+'ORDRE'+colDelim+'DATE BL'+colDelim+'DATE JALON'+colDelim+'ISO VENDEUR'+colDelim+'ISO DESTINATAIRE'
        +colDelim+'CU/QUAI'+colDelim+'ISO EXPEDITEUR'+colDelim+'CODE EQUIPEMENT'+colDelim+'TYPE EQUIPEMENT'+colDelim+'QTE EXPEDIEE'
        +colDelim+'UNITE'+colDelim+'NB UC'+colDelim+'QTE UC'+colDelim+'QTE ORDRE'+colDelim+'UNITE'+colDelim+'TYPE UC'+colDelim+'CODIF UC'+colDelim+'NUMERO UM'
        +colDelim+'NUMERO UC'+colDelim+'PRODUIT'+rowDelim;
        
        $scope.aviexps_comedi.forEach(function(aviexp_comedi) 
        { 
           csv+=aviexp_comedi.id
           +colDelim+aviexp_comedi.numero_bl
           +colDelim+aviexp_comedi.numero_ordre
           +colDelim+aviexp_comedi.date_constitution
           +colDelim+aviexp_comedi.date_jalon           
           +colDelim+aviexp_comedi.iso_vendeur+' '+aviexp_comedi.agence_vendeur      
           +colDelim+aviexp_comedi.iso_destinataire+' '+aviexp_comedi.agence_destinataire    
           +colDelim+aviexp_comedi.point_dechargement       
           +colDelim+aviexp_comedi.iso_expediteur+' '+aviexp_comedi.agence_expediteur      
           +colDelim+aviexp_comedi.code_equipement       
           +colDelim+aviexp_comedi.type_equipement       
           +colDelim+aviexp_comedi.qte_expediee       
           +colDelim+aviexp_comedi.unite_expediee       
           +colDelim+aviexp_comedi.nb_uc       
           +colDelim+aviexp_comedi.qte_uc         
           +colDelim+aviexp_comedi.qte_ordre     
           +colDelim+aviexp_comedi.unite_uc       
           +colDelim+aviexp_comedi.type_uc       
           +colDelim+aviexp_comedi.codif_uc       
           +colDelim+aviexp_comedi.numero_um       
           +colDelim+aviexp_comedi.numero_uc      
           +colDelim+aviexp_comedi.produit
           +rowDelim; 
        }
        );
        var blob = new Blob([csv], {
            type: "data:application/csv;charset=utf-8"
        });
        saveAs(blob, "aviexps_comedi.csv");
    };
});


//aviexp_maestro factory
myApp.factory('AviexpMaestroFactory', function ($resource) {
    return $resource('services/aviexp_maestro/aviexp_maestro/:id', {id: '@id'}, {
        update:{ method:'PUT' },
        log:{ method:'LOG' },
        log_import:{ method:'LOG_IMPORT' }
    });
});
// aviexp_maestro controller
myApp.controller('aviexpMaestroCtrl', function($scope, $http, $routeParams, $location, $resource, AviexpMaestroFactory) {
    
    $scope.isSomethingLoading = 0;
    
    $scope.get_aviexps_maestro = function($resource) {
        $scope.aviexps_maestro = AviexpMaestroFactory.query();    
    }
    angular.extend($scope, {
        model: { file: null },
        upload: function(model) {
            $scope.isSomethingLoading = 1;
            $resource('services/aviexp_maestro/files/:id', { id: "@id" })
            .prototype.$save.call(model.file, function(self, headers) {
                $location.path("/aviexps_maestro");
            });
        }
    });  
    $scope.get_aviexp_maestro_log = function($resource) {
        $scope.log = AviexpMaestroFactory.log();  
    }
    $scope.get_aviexp_maestro_import_log = function($resource) {
        $scope.log_import = AviexpMaestroFactory.log_import();  
    }
    $scope.export_aviexp_maestro = function () {
        colDelim = '";"';
        rowDelim = '"\r\n"';
        csv='"ID'+colDelim+'CU'+colDelim+'BL'+colDelim+'DHEF AVIEXP'+colDelim+'PRODUIT'+colDelim+'ORDRE'+colDelim+'QTE ANNONCEE'+rowDelim;
        
        $scope.aviexps_maestro.forEach(function(aviexp_maestro) 
        { 
           csv+=aviexp_maestro.id
           +colDelim+aviexp_maestro.cu
           +colDelim+aviexp_maestro.numero_bl
           +colDelim+aviexp_maestro.dhef_aviexp     
           +colDelim+aviexp_maestro.produit
           +colDelim+aviexp_maestro.numero_ordre
           +colDelim+aviexp_maestro.qte_annoncee
           +rowDelim; 
        }
        );
        var blob = new Blob([csv], {
            type: "data:application/csv;charset=utf-8"
        });
        saveAs(blob, "aviexps_maestro.csv");
    };
});



//aviexp_converter factory
myApp.factory('AviexpConverterFactory', function ($resource) {
    return $resource('services/aviexp_converter/aviexp_converter/:id', {id: '@id'}, {
        log_import:{ method:'LOG_IMPORT' }
    });
});
// aviexp_converter controller
myApp.controller('aviexpConverterCtrl', function($scope, $http, $routeParams, $location, $resource, AviexpConverterFactory) {
    
    $scope.isSomethingLoading = 0;
    
    angular.extend($scope, {
        model: { file: null },
        upload: function(model) {
            $scope.log_import = AviexpConverterFactory.log_import();
            $scope.isSomethingLoading = 1;
            $resource('services/aviexp_converter/files/:id', { id: "@id" })
            .prototype.$save.call(model.file, function(self, headers) {
                $scope.isSomethingLoading = 0;
                var blob = new Blob([self.text], {
                    type: "data:text/plan"
                });
                saveAs(blob, "aviexp_converter.dat");
            });
        }
    });  
    $scope.get_aviexp_converter_import_log = function($resource) {
        $scope.log_import = AviexpConverterFactory.log_import();  
    }
});
