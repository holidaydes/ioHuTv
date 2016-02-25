angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate) {
  $scope.changeLanguage = function(langKey) {
    $translate.use(langKey);
  };
})

.controller('ChannelsCtrl', function($scope, Channels, TvGuide) {

  $scope.port;
  $scope.channels;
  $scope.port_ids = '';
  $scope.tvGuides = '';

  $scope.$on('$ionicView.enter', function(e) {
    TvGuide.getTvGuides($scope.port, $scope.port_ids, $scope.getDate());
    $scope.tvGuides = TvGuide.channelTvGuides;
    console.log('Query tv guides');
  });

  $scope.$watch(angular.bind(Channels, function() {
    return Channels.channels();
  }), function(value) {
    if (value) {
      $scope.port = Channels.port();
      $scope.channels = Channels.channels();
      for(var i = 0; i < $scope.channels.length; i++)
      {
        $scope.port_ids += $scope.channels[i].port_id + ((!($scope.channels.length - 1)) ? '' : ',');
      }
    }
  });

  $scope.getDate = function(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ((date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
    var day = ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate());
    return year + '-' + month + '-' + day;
  };

  $scope.getHours = function(){
    var date = new Date();
    var hours = ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours());
    return hours;
  };

  $scope.getMinutes = function(){
    var date = new Date();
    var minutes = ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes());
    return minutes;
  };

})

.controller('ChannelsDetailCtrl', function($scope, $stateParams, Channels) {
  $scope.port = Channels.port();
  $scope.channel = Channels.getChannel($stateParams.channelId);
});
