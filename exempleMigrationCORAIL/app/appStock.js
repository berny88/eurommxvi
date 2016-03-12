// stock_sens2 factory
myApp.factory('StockSens2Factory', function ($resource) {
	return $resource('services/stock_sens2/stock_sens2/:id', {id: '@id'}, {
		update:{ method:'PUT' },
		log:{ method:'LOG' },
		log_import:{ method:'LOG_IMPORT' }
	});
});
// stock_sens2 controller
myApp.controller('stockSens2Ctrl', function($scope, $http, $routeParams, $location, $resource, StockSens2Factory) {
	
    $scope.isSomethingLoading = 0;
	
    $scope.get_stocks_sens2 = function($resource) {
		$scope.stocks_sens2 = StockSens2Factory.query();    
	}
	angular.extend($scope, {
		model: { file: null },
		upload: function(model) {
			$scope.isSomethingLoading = 1;
			$resource('services/stock_sens2/files/:id', { id: "@id" })
			.prototype.$save.call(model.file, function(self, headers) {
				$location.path("/stocks_sens2");
			});
		}
	});  
	$scope.get_stock_sens2_log = function($resource) {
		$scope.log = StockSens2Factory.log();  
	}
	$scope.get_stock_sens2_import_log = function($resource) {
		$scope.log_import = StockSens2Factory.log_import();  
	}
    $scope.export_stock_sens2 = function () {
        colDelim = '";"';
        rowDelim = '"\r\n"';
        csv='"ID'+colDelim+'TYPE'+colDelim+'PRODUIT'+colDelim+'SGR'+colDelim+'LIGNE'+colDelim+'QUANTITE'+colDelim+'DATE/HEURE'+rowDelim;
        $scope.stocks_sens2.forEach(function(stock_sens2) 
        { 
           csv+=stock_sens2.id
           +colDelim+stock_sens2.type
           +colDelim+stock_sens2.produit
           +colDelim+stock_sens2.sgr
           +colDelim+stock_sens2.ligne           
           +colDelim+stock_sens2.quantite       
           +colDelim+stock_sens2.dateheure
           +rowDelim; 
        }
        );
        var blob = new Blob([csv], {
            type: "data:application/csv;charset=utf-8"
        });
        saveAs(blob, "stocks_sens2.csv");
    };
});

//stock_comp_produit_sens2 factory
myApp.factory('StockCompProduitSens2Factory', function ($resource) {
    return $resource('services/stock_comp_produit_sens2/stock_comp_produit_sens2/:id', {id: '@id'}, {
        update:{ method:'PUT' },
        initial:{ method:'INITIAL' },
        log:{ method:'LOG' }
    });
});
// stock_comp_produit_sens2 controller
myApp.controller('stockCompProduitSens2Ctrl', function($scope, $http, $routeParams, $location, $resource, StockCompProduitSens2Factory) {
    
    $scope.editingData = [];
    $scope.sortType     = ''; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    
    $scope.enableCommentaire = function(stock_comp_produit_sens2){
        $scope.editingData[stock_comp_produit_sens2.id] = true;
    }
    $scope.updateCommentaire = function(stock_comp_produit_sens2){
        $scope.editingData[stock_comp_produit_sens2.id] = false;
        update_stock_comp_produit_sens2(stock_comp_produit_sens2);
    }
    
    $scope.get_stocks_comp_produit_sens2 = function($resource) {
        $scope.stocks_comp_produit_sens2 = StockCompProduitSens2Factory.query();
    }
    $scope.init_stock_comp_produit_sens2 = function($resource) {
        StockCompProduitSens2Factory.initial(function (data) {
            $scope.stocks_comp_produit_sens2 = StockCompProduitSens2Factory.query();
            $scope.log = StockCompProduitSens2Factory.log(); 
        });
    }
    $scope.update_stock_comp_produit_sens2 = function(stock_comp_produit_sens2) { 
        StockCompProduitSens2Factory.update({id: stock_comp_produit_sens2.id}, stock_comp_produit_sens2, function (data) {
            $scope.editingData[stock_comp_produit_sens2.id] = false;
        });
    }
    $scope.get_stock_comp_produit_sens2_log = function($resource) {
        $scope.log = StockCompProduitSens2Factory.log();  
    }
    $scope.export_stock_comp_produit_sens2 = function () {
        colDelim = '";"';
        rowDelim = '"\r\n"';
        csv='"ID'+colDelim+'REFERENCE'+colDelim+'CU'+colDelim+'QUAI'+colDelim+'DESIGNATION'+colDelim+'COMMENTAIRE'+rowDelim;
        $scope.stocks_comp_produit_sens2.forEach(function(stock_comp_produit_sens2) 
        { 
           csv+=stock_comp_produit_sens2.id
           +colDelim+stock_comp_produit_sens2.reference
           +colDelim+stock_comp_produit_sens2.cu
           +colDelim+stock_comp_produit_sens2.quai
           +colDelim+stock_comp_produit_sens2.designation           
           +colDelim+stock_comp_produit_sens2.commentaire
           +rowDelim; 
        }
        );
        var blob = new Blob([csv], {
            type: "data:application/csv;charset=utf-8"
        });
        saveAs(blob, "comp_produit_sens2.csv");
    };
});