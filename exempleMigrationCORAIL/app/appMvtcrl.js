//mvtcrl_maestro factory
myApp.factory('MvtcrlMaestroFactory', function ($resource) {
    return $resource('services/mvtcrl_maestro/mvtcrl_maestro/:id', {id: '@id'}, {
        update:{ method:'PUT' },
        log:{ method:'LOG' },
        log_import:{ method:'LOG_IMPORT' }
    });
});
// mvtcrl_maestro controller
myApp.controller('mvtcrlMaestroCtrl', function($scope, $http, $routeParams, $location, $resource, MvtcrlMaestroFactory) {
    
    $scope.isSomethingLoading = 0;
    
    $scope.get_mvtcrls_maestro = function($resource) {
        $scope.mvtcrls_maestro = MvtcrlMaestroFactory.query();    
    }
    angular.extend($scope, {
        model: { file: null },
        upload: function(model) {
            $scope.isSomethingLoading = 1;
            $resource('services/mvtcrl_maestro/files/:id', { id: "@id" })
            .prototype.$save.call(model.file, function(self, headers) {
                $location.path("/mvtcrls_maestro");
            });
        }
    });  
    $scope.get_mvtcrl_maestro_log = function($resource) {
        $scope.log = MvtcrlMaestroFactory.log();  
    }
    $scope.get_mvtcrl_maestro_import_log = function($resource) {
        $scope.log_import = MvtcrlMaestroFactory.log_import();  
    }
    $scope.export_mvtcrl_maestro = function () {
        colDelim = '";"';
        rowDelim = '"\r\n"';
        csv='"ID'+colDelim+'SGR'+colDelim+'COFOR'+colDelim+'DHXC'+colDelim+'IMMAT'+colDelim+'OET'+colDelim+'BL'+rowDelim;
        
        $scope.mvtcrls_maestro.forEach(function(mvtcrl_maestro) 
        { 
           csv+=mvtcrl_maestro.id
           +colDelim+mvtcrl_maestro.sgr
           +colDelim+mvtcrl_maestro.cofor_hybride
           +colDelim+mvtcrl_maestro.date_expedition     
           +colDelim+mvtcrl_maestro.immatriculation_moyen
           +colDelim+mvtcrl_maestro.numero_oet
           +colDelim+mvtcrl_maestro.numero_bl
           +rowDelim; 
        }
        );
        var blob = new Blob([csv], {
            type: "data:application/csv;charset=utf-8"
        });
        saveAs(blob, "mvtcrls_maestro.csv");
    };
});
