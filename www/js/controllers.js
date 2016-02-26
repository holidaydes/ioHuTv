angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate) {
  $scope.changeLanguage = function(langKey) {
    $translate.use(langKey);
  };
})

.controller('ChannelsCtrl', function($scope, Channels, TvGuide, TvTime) {

  $scope.port;
  $scope.channels;
  $scope.port_ids = '';
  $scope.tvGuides = '';

  $scope.$on('$ionicView.enter', function(e) {
    TvGuide.getTvGuides($scope.port, $scope.port_ids, TvTime.getDate());
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

  $scope.getCurrentShow = function(programs){
    return TvGuide.getCurrentShow(programs);
  };

})

.controller('ChannelsDetailCtrl', function($scope, $stateParams, Channels, TvGuide, TvTime) {
  $scope.port = Channels.port();
  $scope.channel = Channels.getChannel($stateParams.channelId);
  $scope.tvGuide = '';
  $scope.currentShow = '';
  $scope.nextShows = [];

  $scope.$on('$ionicView.enter', function(e) {
    TvGuide.getTvGuide($scope.port, $scope.channel.port_id, TvTime.getDate());
    $scope.tvGuide = TvGuide.channelTvGuide;
    $scope.currentShow = TvGuide.getCurrentShow($scope.tvGuide.channels[0].programs);
    $scope.nextShows = TvGuide.getCurrentShow($scope.tvGuide.channels[0].programs, 3);
    console.log('Query tv guide');
    $scope.$apply();
  });
});
