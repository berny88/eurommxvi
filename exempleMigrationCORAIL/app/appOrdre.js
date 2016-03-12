myApp.factory('Ordre', function($resource) {
	return $resource('services/ordre_hermes_alto/read_order/:start/:pagination', {start: '@start', pagination: '@pagination'}, {
		update:{ method:'PUT' }
	});
});

myApp.controller('ordreHermesAltoCtrl', ['$scope', 'Ordre',
function ($scope, Ordre) {
  
	var nbParPage = 20;
  
	$scope.ordres = Ordre.query({start: 0, pagination: nbParPage});
	
	//pager
	$scope.totalItems = 20000;
	$scope.currentPage = 1;

	$scope.pageChanged = function() {
		$scope.ordres =  Ordre.query({start: ($scope.currentPage-1)*nbParPage, pagination: nbParPage});
	};
	
	 $scope.maxSize = 5;
  
}]);

myApp.filter('myDateFormat', function(){
	return function(input){
		if(input == '0000-00-00 00:00:00'){
			return "";
		}
		
		return input;
	};
});

myApp.controller('importOrdreCtrl', function($scope, $location, $resource) {
	
    $scope.isSomethingLoading = 0;
	
	angular.extend($scope, {
		model: { file: null },
		upload: function(model) {
			$scope.isSomethingLoading = 1;
			$resource('services/ordre_hermes_alto/files/:id', { id: "@id" })
			.prototype.$save.call(model.file, function(self, headers) {
				// redirection
				$location.path("/ordre_hermes_alto");
			});
		}
	});
});