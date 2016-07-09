angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $state) {
    $scope.login = function () {
      var options = {'remember': false};
      Ionic.Auth
        .login('basic', options, $scope.user.details)
        .then(function () {
            console.log('Logged In');
            $state.go('tab.account');
          },
          function () {
            Ionic.Auth
              .signup($scope.user.details)
              .then(
                function () {
                  Ionic.Auth
                    .login('basic', options, $scope.user.details)
                    .then(
                      function () {
                        console.log('Successfully registered and logged in');
                        $state.go('tab.account');
                      },
                      function () {
                        console.log('Registered but can not login');
                      }
                    );
                }, function () {
                  console.log('Sign up error');
                });
          });
    };

    $scope.user = Ionic.User.current();
    if ($scope.user.isAuthenticated()) {
      $state.go('tab.account');
    }

  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.enter', function(e) {
      $scope.user = Ionic.User.current();

      Ionic.io();
      var push = new Ionic.Push({"debug": true});

      push.register(function (token) {
        push.saveToken(token);
        console.log("Got Token:", token.token);
      });
    });

    $scope.logout = function () {
      Ionic.Auth.logout();
      console.log('logged out');
      $state.go('tab.dash');
    };
  });
