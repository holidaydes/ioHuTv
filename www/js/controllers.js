angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate) {
  $scope.changeLanguage = function(langKey){
    $translate.use(langKey);
  };
})

.controller('ChannelsCtrl', function($scope, Channels) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.channels = Channels.all();
})

.controller('ChannelsDetailCtrl', function($scope, $stateParams, Channels) {
  $scope.channel = Channels.get($stateParams.channelId);
})
