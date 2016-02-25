angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate) {
  $scope.changeLanguage = function(langKey){
    $translate.use(langKey);
  };
})

.controller('ChannelsCtrl', function($scope, Channels) {

  $scope.$on('$ionicView.enter', function(e) {
    console.error('ERR', 'there will be some funny function');
  });

  $scope.$watch(angular.bind(Channels, function() {
   return Channels.all();
 }), function(value) {
   if (value) {
     $scope.channels = Channels.all();
   }
 });

})

.controller('ChannelsDetailCtrl', function($scope, $stateParams, Channels) {
  $scope.channel = Channels.get($stateParams.channelId);
})
