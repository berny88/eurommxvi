// produit factory
myApp.factory('ProduitFactory', function ($resource) {
	return $resource('services/produit/produit/:id', {id: '@id'}, {
		update:{ method:'PUT' },
		log:{ method:'LOG' },
		log_import:{ method:'LOG_IMPORT' }
	});
});
// produit controller
myApp.controller('produitCtrl', function($scope, $http, $routeParams, $location, $resource, ProduitFactory) {
	
    $scope.isSomethingLoading = 0;
	
	$scope.get_produits = function($resource) {
		$scope.produits = ProduitFactory.query();
	}
	$scope.load_produit = function($resource) {
		$scope.produit = ProduitFactory.get({id: $routeParams.id});
	}
	$scope.add_produit = function($resource) { 
		ProduitFactory.save({}, $scope.produit, function (data) {
			$location.path("/produits");
		});
	} 
	$scope.update_produit = function($resource) { 
		ProduitFactory.update({id: $scope.produit.id}, $scope.produit, function (data) {
			$location.path('/produits');
		});
	} 
	$scope.delete_produit = function($resource) {
		ProduitFactory.delete({id: $scope.produit.id}, $scope.produit, function (data) {
			$location.path('/produits');
		});
	}
	angular.extend($scope, {
		model: { file: null },
		upload: function(model) {
			$scope.isSomethingLoading = 1;
			$resource('services/produit/files/:id', { id: "@id" })
			.prototype.$save.call(model.file, function(self, headers) {
				$location.path("/produits");
			});
		}
	});	      
	$scope.get_produit_log = function($resource) {
		$scope.log = ProduitFactory.log();  
	}
	$scope.get_produit_import_log = function($resource) {
		$scope.log_import = ProduitFactory.log_import();  
	}
	$scope.export_produit_old = function () {
		var blob = new Blob([document.getElementById('exportable').innerHTML], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
		});
		saveAs(blob, "produit.xls");
	};
	$scope.export_produit = function () {
		colDelim = '";"';
		rowDelim = '"\r\n"';
		csv='"ID'+colDelim+'REFERENCE'+colDelim+'CU'+colDelim+'QUAI'+colDelim+'DESIGNATION'+rowDelim;
		$scope.produits.forEach(function(produit) 
		{ 
		   csv+=produit.id
		   +colDelim+produit.reference
		   +colDelim+produit.cu
		   +colDelim+produit.quai
		   +colDelim+produit.designation
		   +rowDelim; 
		}
		);
		var blob = new Blob([csv], {
			type: "data:application/csv;charset=utf-8"
		});
		saveAs(blob, "produit.csv");
	};
});