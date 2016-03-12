// alerte_maestro factory
myApp.factory('AlerteMaestroFactory', function ($resource) {
	return $resource('services/alerte_maestro/alerte_maestro/:id', {id: '@id'}, {
		update:{ method:'PUT' },
		log:{ method:'LOG' },
		log_import:{ method:'LOG_IMPORT' }
	});
});
// alerte_maestro controller
myApp.controller('alerteMaestroCtrl', function($scope, $http, $routeParams, $location, $resource, AlerteMaestroFactory) {
	
    $scope.isSomethingLoading = 0;
	
	$scope.get_alertes_maestro = function($resource) {
		$scope.alertes_maestro = AlerteMaestroFactory.query();    
	}
	$scope.load_alerte_maestro = function($resource) {
		$scope.alerte_maestro = AlerteMaestroFactory.get({id: $routeParams.id});
	}
	$scope.add_alerte_maestro = function($resource) { 
		AlerteMaestroFactory.save({}, $scope.alerte_maestro, function (data) {
			$location.path("/alertes_maestro");
		});
	} 
	$scope.update_alerte_maestro = function($resource) { 
		AlerteMaestroFactory.update({id: $scope.alerte_maestro.id}, $scope.alerte_maestro, function (data) {
			$location.path('/alertes_maestro');
		});
	} 
	$scope.delete_alerte_maestro = function($resource) {
		AlerteMaestroFactory.delete({id: $scope.alerte_maestro.id}, $scope.alerte_maestro, function (data) {
			$location.path('/alertes_maestro');
		});
	}
	angular.extend($scope, {
		model: { file: null },
		upload: function(model) {
			$scope.isSomethingLoading = 1;
			$resource('services/alerte_maestro/files/:id', { id: "@id" })
			.prototype.$save.call(model.file, function(self, headers) {
				$location.path("/alertes_maestro");
			});
		}
	});  
	$scope.get_alerte_maestro_log = function($resource) {
		$scope.log = AlerteMaestroFactory.log();  
	}
	$scope.get_alerte_maestro_import_log = function($resource) {
		$scope.log_import = AlerteMaestroFactory.log_import();  
	}
	$scope.export_alerte_maestro = function () {
		var blob = new Blob([document.getElementById('exportable').innerHTML], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
		});
		saveAs(blob, "alertes_maestro.xls");
	};
});

// alerte_corail factory
myApp.factory('AlerteCorailFactory', function ($resource) {
	return $resource('services/alerte_corail/alerte_corail/:id', {id: '@id'}, {
		update:{ method:'PUT' },
		log:{ method:'LOG' },
		log_import:{ method:'LOG_IMPORT' }
	});
});
// alerte_corail controller
myApp.controller('alerteCorailCtrl', function($scope, $http, $routeParams, $location, $resource, AlerteCorailFactory) {
	
    $scope.isSomethingLoading = 0;
	
    $scope.get_alertes_corail = function($resource) {
		$scope.alertes_corail = AlerteCorailFactory.query();    
	}
	$scope.load_alerte_corail = function($resource) {
		$scope.alerte_corail = AlerteCorailFactory.get({id: $routeParams.id});
	}
	$scope.add_alerte_corail = function($resource) { 
		AlerteCorailFactory.save({}, $scope.alerte_corail, function (data) {
			$location.path("/alertes_corail");
		});
	} 
	$scope.update_alerte_corail = function($resource) { 
		AlerteCorailFactory.update({id: $scope.alerte_corail.id}, $scope.alerte_corail, function (data) {
			$location.path('/alertes_corail');
		});
	} 
	$scope.delete_alerte_corail = function($resource) {
		AlerteCorailFactory.delete({id: $scope.alerte_corail.id}, $scope.alerte_corail, function (data) {
			$location.path('/alertes_corail');
		});
	}
	angular.extend($scope, {
		model: { file: null },
		upload: function(model) {
			$scope.isSomethingLoading = 1;
			$resource('services/alerte_corail/files/:id', { id: "@id" })
			.prototype.$save.call(model.file, function(self, headers) {
				$location.path("/alertes_corail");
			});
		}
	});  
	$scope.get_alerte_corail_log = function($resource) {
		$scope.log = AlerteCorailFactory.log();  
	}
	$scope.get_alerte_corail_import_log = function($resource) {
		$scope.log_import = AlerteCorailFactory.log_import();  
	}
	$scope.export_alerte_corail = function () {
		var blob = new Blob([document.getElementById('exportable').innerHTML], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
		});
		saveAs(blob, "alertes_corail.xls");
	};
});

// alerte_comp_maestro_corail factory
myApp.factory('AlerteCompMaestroCorailFactory', function ($resource) {
	return $resource('services/alerte_comp_maestro_corail/alerte_comp_maestro_corail/:id', {id: '@id'}, {
		update:{ method:'PUT' },
		initial:{ method:'INITIAL' },
		log:{ method:'LOG' }
	});
});
// alerte_comp_maestro_corail controller
myApp.controller('alerteCompMaestroCorailCtrl', function($scope, $http, $routeParams, $location, $resource, AlerteCompMaestroCorailFactory, ParametreFactory) {
	
    $scope.editingData = [];
	$scope.sortType     = ''; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	
	$scope.enableCommentaire = function(alerte_comp_maestro_corail){
		$scope.editingData[alerte_comp_maestro_corail.id] = true;
	}
	$scope.updateCommentaire = function(alerte_comp_maestro_corail){
		$scope.editingData[alerte_comp_maestro_corail.id] = false;
		update_alerte_comp_maestro_corail(alerte_comp_maestro_corail);
	}
	
	$scope.get_alertes_comp_maestro_corail = function($resource) {
		$scope.alertes_comp_maestro_corail = AlerteCompMaestroCorailFactory.query();  
		/*for (var i = 0, length = $scope.alerte_comp_maestro_corail.length; i < length; i++) {
			$scope.editingData[$scope.alerte_comp_maestro_corail[i].id] = false;
		}*/		
	}
	$scope.init_alerte_comp_maestro_corail = function($resource) {
		AlerteCompMaestroCorailFactory.initial(function (data) {
			$scope.alertes_comp_maestro_corail = AlerteCompMaestroCorailFactory.query();
			$scope.log = AlerteCompMaestroCorailFactory.log(); 
		});
	}
	$scope.update_alerte_comp_maestro_corail = function(alerte_comp_maestro_corail) { 
		AlerteCompMaestroCorailFactory.update({id: alerte_comp_maestro_corail.id}, alerte_comp_maestro_corail, function (data) {
			$scope.editingData[alerte_comp_maestro_corail.id] = false;
		});
	}  
    $scope.get_site= function($resource) {
        $scope.site = ParametreFactory.getSite();
    }
	$scope.get_alerte_comp_maestro_corail_log = function($resource) {
		$scope.log = AlerteCompMaestroCorailFactory.log();  
	}
	$scope.export_alerte_comp_maestro_corail = function () {
		colDelim = '";"';
		rowDelim = '"\r\n"';
		csv='"ID'+colDelim+'REFERENCE'+colDelim+'DESIGNATION'+colDelim+'MAESTRO Rupture dotation'+colDelim+'CORAIL Rupture mini'+colDelim+'Ecart (h) Rupture mini'+colDelim+'MAESTRO Rupture'+colDelim+'CORAIL Rupture'+colDelim+'Ecart (h) Rupture'+colDelim+'COMMENTAIRE'+rowDelim;
		$scope.alertes_comp_maestro_corail.forEach(function(alerte_comp_maestro_corail) 
		{ 
		   csv+=alerte_comp_maestro_corail.id
		   +colDelim+alerte_comp_maestro_corail.reference
		   +colDelim+alerte_comp_maestro_corail.designation
		   +colDelim+alerte_comp_maestro_corail.date_rupture_dotation_atelier_maestro
		   +colDelim+alerte_comp_maestro_corail.date_rupture_minimale_corail
		   +colDelim+alerte_comp_maestro_corail.ecart_date_rupture_minimale
		   +colDelim+alerte_comp_maestro_corail.date_rupture_maestro
		   +colDelim+alerte_comp_maestro_corail.date_rupture_corail
		   +colDelim+alerte_comp_maestro_corail.ecart_date_rupture
		   +colDelim+alerte_comp_maestro_corail.commentaire
		   +rowDelim; 
		}
		);
		var blob = new Blob([csv], {
			type: "data:application/csv;charset=utf-8"
		});
		saveAs(blob, "comp_maestro_corail.csv");
	};
/*	
	$scope.export_alerte_comp_maestro_corail = function () {
		var blob = new Blob([document.getElementById('exportable').innerHTML], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
		});
		saveAs(blob, "comp_maestro_corail.xls");
	};
*/
});

// alerte_comp_corail_maestro factory
myApp.factory('AlerteCompCorailMaestroFactory', function ($resource) {
	return $resource('services/alerte_comp_corail_maestro/alerte_comp_corail_maestro/:id', {id: '@id'}, {
		update:{ method:'PUT' },
		initial:{ method:'INITIAL' },
		log:{ method:'LOG' }
	});
});
// alerte_comp_corail_maestro controller
myApp.controller('alerteCompCorailMaestroCtrl', function($scope, $http, $routeParams, $location, $resource, AlerteCompCorailMaestroFactory, ParametreFactory) {
	
    $scope.editingData = [];
	$scope.sortType     = ''; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	
	$scope.enableCommentaire = function(alerte_comp_corail_maestro){
		$scope.editingData[alerte_comp_corail_maestro.id] = true;
	}
	$scope.updateCommentaire = function(alerte_comp_corail_maestro){
		$scope.editingData[alerte_comp_corail_maestro.id] = false;
		update_alerte_comp_corail_maestro(alerte_comp_corail_maestro);
	}
	
	$scope.get_alertes_comp_corail_maestro = function($resource) {
		$scope.alertes_comp_corail_maestro = AlerteCompCorailMaestroFactory.query();  
		/*for (var i = 0, length = $scope.alerte_comp_corail_maestro.length; i < length; i++) {
			$scope.editingData[$scope.alerte_comp_corail_maestro[i].id] = false;
		}*/		
	}
	$scope.init_alerte_comp_corail_maestro = function($resource) {
		AlerteCompCorailMaestroFactory.initial(function (data) {
			$scope.alertes_comp_corail_maestro = AlerteCompCorailMaestroFactory.query();
			$scope.log = AlerteCompCorailMaestroFactory.log();  
		});
	}
	$scope.update_alerte_comp_corail_maestro = function(alerte_comp_corail_maestro) { 
		AlerteCompCorailMaestroFactory.update({id: alerte_comp_corail_maestro.id}, alerte_comp_corail_maestro, function (data) {
			$scope.editingData[alerte_comp_corail_maestro.id] = false;
		});
	} 
	$scope.get_site = function($resource) {
	    $scope.site = ParametreFactory.getSite();
	}
	$scope.get_alerte_comp_corail_maestro_log = function($resource) {
		$scope.log = AlerteCompCorailMaestroFactory.log();  
	}
    $scope.export_alerte_comp_corail_maestro = function () {
        colDelim = '";"';
        rowDelim = '"\r\n"';
        csv='"ID'+colDelim+'REFERENCE'+colDelim+'DESIGNATION'+colDelim+'CORAIL Rupture mini'+colDelim+'MAESTRO Rupture dotation'+colDelim+'Ecart (h) Rupture mini'+colDelim+'CORAIL Rupture'+colDelim+'MAESTRO Rupture'+colDelim+'Ecart (h) Rupture'+colDelim+'COMMENTAIRE'+rowDelim;
        $scope.alertes_comp_corail_maestro.forEach(function(alerte_comp_corail_maestro) 
        { 
           csv+=alerte_comp_corail_maestro.id
           +colDelim+alerte_comp_corail_maestro.reference
           +colDelim+alerte_comp_corail_maestro.designation
           +colDelim+alerte_comp_corail_maestro.date_rupture_minimale_corail
           +colDelim+alerte_comp_corail_maestro.date_rupture_dotation_atelier_maestro
           +colDelim+alerte_comp_corail_maestro.ecart_date_rupture_minimale
           +colDelim+alerte_comp_corail_maestro.date_rupture_corail
           +colDelim+alerte_comp_corail_maestro.date_rupture_maestro
           +colDelim+alerte_comp_corail_maestro.ecart_date_rupture
           +colDelim+alerte_comp_corail_maestro.commentaire
           +rowDelim; 
        }
        );
        var blob = new Blob([csv], {
            type: "data:application/csv;charset=utf-8"
        });
        saveAs(blob, "comp_maestro_corail.csv");
    };
/*    
	$scope.export_alerte_comp_corail_maestro = function () {
		var blob = new Blob([document.getElementById('exportable').innerHTML], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
		});
		saveAs(blob, "comp_corail_maestro.xls");
	};
*/
});