euro2016App.controller('ChatCtrl', ['$scope', '$routeParams', '$http', '$q', '$location', '$timeout', '$window',
                            function ($scope, $routeParams, $http, $q, $location, $timeout, $window) {

        var canceler = $q.defer();

        hideAlerts();

        $scope.getPosts = function() {
            hideAlerts();
            $http.get('chat/apiv1.0/posts', {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.posts = data;
            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération de la liste des posts ; erreur HTTP : " + status);
            });
            $('#postList').show();
        }

        $scope.doPost = function() {

            var currentUser = {};
            if (isConnected($window)) {
                currentUser = getConnectedUser($window);
            }

            var newPost = {};
            newPost.nickName = currentUser.nickName;
            newPost.message = $('#inputText').val();
            newPost.date = new Date();
            $scope.posts.posts.unshift(newPost);

            $('#inputText').val('');
            $('#inputText').focus();

        }

        $('#inputText').focus()

        // only the connected people can post a message
        $scope.isConnected = function() {
            // security.js :
            return isConnected($window);
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            hideAlerts();
            canceler.resolve();
        });

}]);