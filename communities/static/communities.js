euro2016App.controller('CommunitiesCtrl', ['$scope', '$routeParams', '$http', '$q', '$location', '$timeout', '$window',
                            function ($scope, $routeParams, $http, $q, $location, $timeout, $window) {

        var canceler = $q.defer();

        $scope.sortType     = ''; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order

        $scope.community = {};
        $scope.communityToDelete = {};
        $scope.communities = {};
        hideAlerts();

        $scope.getCommunities = function() {
            hideAlerts();
            $http.get('communities/apiv1.0/communities', {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.communities = data;
            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération de la liste des communautés ; erreur HTTP : " + status);
            });
        }

        $scope.getCommunity = function() {
            hideAlerts();
            $http.get('communities/apiv1.0/communities/' + $routeParams.com_id, {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.community = data;
            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération de la communauté ; erreur HTTP : " + status);
            });
        }

        $scope.updateCommunity = function() {
            hideAlerts();
            $scope.communityToUpdate = $scope.community.community;
            $http.put('communities/apiv1.0/communities', {communityToUpdate: $scope.communityToUpdate, timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $location.path("/communities")
                //$timeout(function() {
                //       showAlertSuccess("Communauté modifiée avec succès !!");
                //    }, 1000);
                $.notify("Communauté modifiée avec succès !!" , "success");
            })
            .error(function(data, status, headers, config) {
                if (status==403){
                    showAlertError("Même pas en rêve ! status=" + status+ " " + data);
                } else {
                    showAlertError("Erreur lors de la modification de la communauté ; erreur HTTP : " + status);
                }
            });
        }

        $scope.createCommunity = function() {
            hideAlerts();
            $scope.communityToCreate.admin_user_id = getConnectedUser($window).user_id;
            $http.post('communities/apiv1.0/communities', {communityToCreate: $scope.communityToCreate, timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $location.path("/communities")
                //$timeout(function() {
                //       showAlertSuccess("Communauté créée avec succès !!");
                //    }, 1000);
                $.notify("Communauté créée avec succès !!" , "success");

            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la création de la communauté ; erreur HTTP : " + status);
            });
        }

        $scope.deleteCommunity = function(communityToDelete) {
            $scope.communityToDelete = communityToDelete;
            showModal();
        }

        // launched when the "OK" button of the confirmation modal is pressed :
        $scope.confirm = function() {
            hideAlerts();
            $http.delete('communities/apiv1.0/communities/' + $scope.communityToDelete.com_id, {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.communities = data;
                closeModal();
                //showAlertSuccess("Communauté [" + $scope.communityToDelete.title + "] supprimée avec succès !");
                $.notify("Communauté [" + $scope.communityToDelete.title + "] supprimée avec succès !" , "success");
            })
            .error(function(data, status, headers, config) {
                closeModal();
                if (status==403){
                    showAlertError("Même pas en rêve ! status=" + status+ " " + data);
                } else {
                    showAlertError("Erreur lors de la suppression de la communauté ; erreur HTTP : " + status);
                }
            });
        }

        $scope.getNumberOfPlayersInCommunity = function(com_id) {
            hideAlerts();
            $http.get('communities/apiv1.0/communities/' + com_id + '/getplayersnumber', {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $('#nbPlayers_'+com_id).html(data.data.playerCount);
            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération du nombre de parieurs dans la communauté ; erreur HTTP : " + status);
            });
        }


        $scope.getPlayersInCommunity = function() {
            hideAlerts();
            $http.get('communities/apiv1.0/communities/' + $routeParams.com_id + '/players', {timeout: canceler.promise})
            .success(function(data, status, headers, config) {
                $scope.players = data;
            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération des parieurs dans la communauté ; erreur HTTP : " + status);
            });
        }

        $scope.getCommunityForUpdate = function() {
            $scope.getCommunity();
            $('#title').focus();
        }


        $scope.setFocusWhenCreatingCommunity= function() {
            $('#title').focus();
        }

        $scope.hasAuthorization = function(community) {
            var currentUser = {};
            if (isConnected($window)) {
                currentUser = getConnectedUser($window);
            }
            return ((currentUser.user_id == community.admin_user_id) || isAdmin($window)) ? true : false;
        }

        // only the connected people can create/delete/modify a community
        $scope.isConnected = function() {
            // security.js :
            return isConnected($window);
        }

        // Aborts the $http request if it isn't finished.
        $scope.$on('$destroy', function(){
            hideAlerts();
            canceler.resolve();
        });

    var blog = this;
    $scope.title = "Blog de la communauté";

    $scope.posts = {};
    $http.get('communities/apiv1.0/communities/' + $routeParams.com_id + '/blogs').success(function(data){
      $scope.posts = data.data.blogs;
    });

    $scope.tab = 'blog';

    $scope.selectTab = function(setTab){
      $scope.tab = setTab;
      console.log($scope.tab)
    };

    $scope.isSelected = function(checkTab){
      return $scope.tab === checkTab;
    };

    $scope.incLikes= function(post){
      console.log("inc likes" + post.likes)
      post.likes = post.likes +1;
    };

    $scope.post = {};
    $scope.addPost = function(){
      $scope.post.createdOn = Date.now();
      $scope.post.comments = [];
      $scope.post.likes = 0;
      $scope.posts.unshift(this.post);
      $scope.tab = 0;
      $scope.post ={};
    };

    $scope.comment = {};
    $scope.addComment = function(post){
      $scope.comment.createdOn = Date.now();
      $scope.comments.push($scope.comment);
      $scope.comment ={};
    };
  }]);

