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
                $('#spin').hide();
            })
            .error(function(data, status, headers, config) {
                showAlertError("Erreur lors de la récupération de la liste des communautés ; erreur HTTP : " + status);
                $('#spin').hide();
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

            $scope.displayBlogPostSaveButton = false;
            console.log("getCommunity::isConnected($window)="+isConnected($window));
            if (isConnected($window)) {
                $scope.displayBlogPostSaveButton =true;
            }

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

/* *********** */
/* Blog block  */
/* *********** */
    var blog = this;
    $scope.title = "Blog de la communauté";

    $scope.posts = {};
    $http.get('communities/apiv1.0/communities/' + $routeParams.com_id + '/blogs').success(function(data){
      $scope.posts = data.data.blogs;
    });

    $scope.tab = 'CommunitiesCtrl';

    $scope.selectTab = function(setTab){
      $scope.tab = setTab;
      console.log("select tab " + $scope.tab)
    };

    $scope.isSelected = function(checkTab){
      //console.log("isSelected checkTab=" + checkTab + " / $scope.tab=" + $scope.tab)
      return $scope.tab === checkTab;
    };

    $scope.incLikes= function(post){
      console.log("inc likes" + post.likes)
      post.likes = post.likes +1;
    };

    $scope.post = {};
    $scope.addPost = function(){
        $scope.post.createdOn = Date.now();
        $scope.post.author = getConnectedUser($window).nickName;
        $scope.post.comments = [];
        $scope.post.likes = 0;
        $scope.tab = 0;
        console.log("addPost :: post=" + $scope.post + " / user="+getConnectedUser($window).email);
        console.log("addPost :: post.body=" + $scope.post.body );
          //TODO faire les contrôles de sécu coté client
        hideAlerts();
        $http.post('communities/apiv1.0/communities/' + $routeParams.com_id + '/blogs', {blogpost: $scope.post, timeout: canceler.promise})
        .success(function(data, status, headers, config) {
            console.log("new blog_id="+data.blog.blog_id)
            $scope.post = data.blog
            $scope.posts.unshift($scope.post);
            $.notify("Post créé avec succès !!" , "success");
            $scope.selectTab('CommunitiesCtrl')
            $scope.post ={};
        })
        .error(function(data, status, headers, config) {
            showAlertError("Erreur lors de la création du post; erreur HTTP : " + status);
        });
    };

    $scope.deletePost = function(index){
        console.log("deletePost :: post index=" + index);
        post = $scope.posts[index];
        console.log("deletePost :: post.blog_id =" + post.blog_id);
        $scope.posts.splice(index, 1);
        console.log("after deletePost :: posts=" + $scope.posts);
        $http.delete('communities/apiv1.0/communities/' + $routeParams.com_id + '/blogs/'+post.blog_id,
         { timeout: canceler.promise})
        .success(function(data, status, headers, config) {
            $.notify("Post supprimé avec succès !!" , "success");
            $scope.selectTab('CommunitiesCtrl')
        })
        .error(function(data, status, headers, config) {
            showAlertError("Erreur lors de la suppression du post; erreur HTTP : " + status);
        });
    };

    $scope.comments = {};
    $scope.comment = {};

    $scope.addComment = function(post){
        $scope.comment.createdOn = Date.now();
        $scope.comment.author= "TODO_get_currentUserToTrack";
        console.log("addComment:: $scope.comments=" + $scope.comments);
        post.comments.push($scope.comment);
        console.log("addComment:: try to add comment:: post=" + post.blog_id);
        console.log("addComment:: try to add comment:: comment=" + $scope.comment);
        hideAlerts();
        $http.post('communities/apiv1.0/communities/' + $routeParams.com_id + '/blogs/'+post.blog_id+'/comments',
                    {comment: $scope.comment, timeout: canceler.promise})
        .success(function(data, status, headers, config) {
            console.log("new comment result="+data.msg)
            $.notify("Commentaire créé avec succès !!" , "success");
            $scope.comment ={};
        })
        .error(function(data, status, headers, config) {
            showAlertError("Erreur lors de la création du post; erreur HTTP : " + status);
        });
    };

}]);

