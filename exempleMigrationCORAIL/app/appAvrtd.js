// avrtd_pegase factory
myApp.factory('AvrtdPegaseFactory', function ($resource) {
	return $resource('services/avrtd_pegase/avrtd_pegase/:id', {id: '@id'}, {
		update:{ method:'PUT' },
		log:{ method:'LOG' },
		log_import:{ method:'LOG_IMPORT' }
	});
});
// avrtd_pegase controller
myApp.controller('avrtdPegaseCtrl', function($scope, $http, $routeParams, $location, $resource, AvrtdPegaseFactory) {
	
    $scope.isSomethingLoading = 0;
	
    $scope.get_avrtds_pegase = function($resource) {
		$scope.avrtds_pegase = AvrtdPegaseFactory.query();    
	}
	angular.extend($scope, {
		model: { file: null },
		upload: function(model) {
			$scope.isSomethingLoading = 1;
			$resource('services/avrtd_pegase/files/:id', { id: "@id" })
			.prototype.$save.call(model.file, function(self, headers) {
				$location.path("/avrtds_pegase");
			});
		}
	});  
	$scope.get_avrtd_pegase_log = function($resource) {
		$scope.log = AvrtdPegaseFactory.log();  
	}
	$scope.get_avrtd_pegase_import_log = function($resource) {
		$scope.log_import = AvrtdPegaseFactory.log_import();  
	}
    $scope.export_avrtd_pegase = function () {
        colDelim = '";"';
        rowDelim = '"\r\n"';
        csv='"ID'+colDelim+'TYPE'+colDelim+'PRODUIT'+colDelim+'SGR'+colDelim+'LIGNE'+colDelim+'QUANTITE'+colDelim+'DATE/HEURE'+rowDelim;
        $scope.avrtds_pegase.forEach(function(avrtd_pegase) 
        { 
           csv+=avrtd_pegase.id
           +colDelim+avrtd_pegase.type
           +colDelim+avrtd_pegase.produit
           +colDelim+avrtd_pegase.sgr
           +colDelim+avrtd_pegase.ligne           
           +colDelim+avrtd_pegase.quantite       
           +colDelim+avrtd_pegase.dateheure
           +rowDelim; 
        }
        );
        var blob = new Blob([csv], {
            type: "data:application/csv;charset=utf-8"
        });
        saveAs(blob, "avrtds_pegase.csv");
    };
});


//avrtd_comp_produit_pegase factory
myApp.factory('AvrtdCompProduitPegaseFactory', function ($resource) {
  return $resource('services/avrtd_comp_produit_pegase/avrtd_comp_produit_pegase/:id', {id: '@id'}, {
      update:{ method:'PUT' },
      initial:{ method:'INITIAL' },
      log:{ method:'LOG' }
  });
});
//avrtd_comp_produit_pegase controller
myApp.controller('avrtdCompProduitPegaseCtrl', function($scope, $http, $routeParams, $location, $resource, AvrtdCompProduitPegaseFactory) {
  
  $scope.editingData = [];
  $scope.sortType     = ''; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  
  $scope.enableCommentaire = function(avrtd_comp_produit_pegase){
      $scope.editingData[avrtd_comp_produit_pegase.id] = true;
  }
  $scope.updateCommentaire = function(avrtd_comp_produit_pegase){
      $scope.editingData[avrtd_comp_produit_pegase.id] = false;
      update_avrtd_comp_produit_pegase(avrtd_comp_produit_pegase);
  }
  
  $scope.get_avrtds_comp_produit_pegase = function($resource) {
      $scope.avrtds_comp_produit_pegase = AvrtdCompProduitPegaseFactory.query();
  }
  $scope.init_avrtd_comp_produit_pegase = function($resource) {
      AvrtdCompProduitPegaseFactory.initial(function (data) {
          $scope.avrtds_comp_produit_pegase = AvrtdCompProduitPegaseFactory.query();
          $scope.log = AvrtdCompProduitPegaseFactory.log(); 
      });
  }
  $scope.update_avrtd_comp_produit_pegase = function(avrtd_comp_produit_pegase) { 
      AvrtdCompProduitPegaseFactory.update({id: avrtd_comp_produit_pegase.id}, avrtd_comp_produit_pegase, function (data) {
          $scope.editingData[avrtd_comp_produit_pegase.id] = false;
      });
  }
  $scope.get_avrtd_comp_produit_pegase_log = function($resource) {
      $scope.log = AvrtdCompProduitPegaseFactory.log();  
  }
  $scope.export_avrtd_comp_produit_pegase = function () {
      colDelim = '";"';
      rowDelim = '"\r\n"';
      csv='"ID'+colDelim+'REFERENCE'+colDelim+'CU'+colDelim+'QUAI'+colDelim+'DESIGNATION'+colDelim+'COMMENTAIRE'+rowDelim;
      $scope.avrtds_comp_produit_pegase.forEach(function(avrtd_comp_produit_pegase) 
      { 
         csv+=avrtd_comp_produit_pegase.id
         +colDelim+avrtd_comp_produit_pegase.reference
         +colDelim+avrtd_comp_produit_pegase.cu
         +colDelim+avrtd_comp_produit_pegase.quai
         +colDelim+avrtd_comp_produit_pegase.designation           
         +colDelim+avrtd_comp_produit_pegase.commentaire
         +rowDelim; 
      }
      );
      var blob = new Blob([csv], {
          type: "data:application/csv;charset=utf-8"
      });
      saveAs(blob, "comp_produit_pegase.csv");
  };
});