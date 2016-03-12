// parametre factory
myApp.factory('ParametreFactory', function ($resource) {
    return $resource('services/parametre/parametre/:id:nom', {id: '@id', nom: '@nom'}, {
        update:{ method:'PUT' },
        log:{ method:'LOG' },
        getSite:{ method: 'GETBYNOM', params: { nom: "site" }}
    });
});
// parametre controller
myApp.controller('parametreCtrl', function($scope, $http, $routeParams, $location, $resource, ParametreFactory) {
  
    $scope.get_parametres = function($resource) {
        $scope.parametres = ParametreFactory.query();    
    }
    $scope.load_parametre = function($resource) {
        $scope.parametre = ParametreFactory.get({id: $routeParams.id});
    }
    $scope.add_parametre = function($resource) {
        ParametreFactory.save({}, $scope.parametre, function (data) {
            $location.path("/parametres");
        });
    } 
    $scope.update_parametre = function($resource) {
        ParametreFactory.update({id: $scope.parametre.id}, $scope.parametre, function (data) {
            $location.path('/parametres');
        });
    } 
    $scope.delete_parametre = function($resource) {
        ParametreFactory.delete({id: $scope.parametre.id}, $scope.parametre, function (data) {
            $location.path('/parametres');
        });
    }	
	$scope.export_parametre_old = function () {
		var blob = new Blob([document.getElementById('exportable').innerHTML], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
		});
		saveAs(blob, "parametre.xls");
	}
    $scope.get_parametre_log = function($resource) {
        $scope.log = ParametreFactory.log();   
    }
	$scope.export_parametre = function () {
		colDelim = '";"';
		rowDelim = '"\r\n"';
		csv='"ID'+colDelim+'NOM'+colDelim+'VALEUR'+rowDelim;
		$scope.parametres.forEach(function(parametre) 
		{ 
		   csv+=parametre.id
		   +colDelim+parametre.nom
		   +colDelim+parametre.valeur
		   +rowDelim; 
		}
		);
		var blob = new Blob([csv], {
			type: "data:application/csv;charset=utf-8"
		});
		saveAs(blob, "parametre.csv");
	};
});
