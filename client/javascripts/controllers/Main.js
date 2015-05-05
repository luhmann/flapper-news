angular.module('flapperNews').controller('MainCtrl', function($scope, auth, posts) {
        $scope.posts = posts.posts;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addPost = function () {
            if(!$scope.title || $scope.title === '') {
                return;
            }

            posts.create({
                title: $scope.title,
                link: $scope.link
            });

            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementUpvotes = function (post) {
            posts.upvote(post);
        };
    }
);