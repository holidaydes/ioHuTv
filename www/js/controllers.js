angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate) {
  $scope.changeLanguage = function(langKey) {
    $translate.use(langKey);
  };
  $scope.nextLimit = 3;
})

.controller('ChannelsCtrl', function($scope, Channels, TvGuide, TvTime) {
  $scope.port;
  $scope.channels;
  $scope.port_ids = '';
  $scope.tvGuides = '';
  $scope.loaded = false;

  $scope.$on('$ionicView.enter', function(e) {
    TvGuide.getTvGuides($scope.port, $scope.port_ids, TvTime.getDate());
    console.log('Query tv guides');
    $scope.$watch(angular.bind(TvGuide, function() {
      return TvGuide.channelTvGuides;
    }), function(value) {
      if (value) {
        $scope.tvGuides = TvGuide.channelTvGuides;
        $scope.loaded = true;
      }
    });
  });

  $scope.$watch(angular.bind(Channels, function() {
    return Channels.channels();
  }), function(value) {
    if (value) {
      $scope.port = Channels.port();
      $scope.channels = Channels.channels();
      for (var i = 0; i < $scope.channels.length; i++) {
        $scope.port_ids += $scope.channels[i].port_id + ((!($scope.channels.length - 1)) ? '' : ',');
      }
    }
  });

  $scope.getCurrentShow = function(programs) {
    if (programs != undefined) {
      return TvGuide.getCurrentShow(programs);
    }
    return null;
  };

})

.controller('ChannelsDetailCtrl', function($scope, $stateParams, Channels, TvGuide, TvTime) {
  $scope.port = Channels.port();
  $scope.channel = Channels.getChannel($stateParams.channelId);
  $scope.tvGuide = '';
  $scope.currentShow = '';
  $scope.nextShows = [];
  $scope.loaded = false;
  $scope.capture = 'img/default.jpg';

  $scope.$on('$ionicView.enter', function(e) {
    TvGuide.getTvGuide($scope.port, $scope.channel.port_id, TvTime.getDate());
    console.log('Query tv guide');
    $scope.$watch(angular.bind(TvGuide, function() {
      return TvGuide.channelTvGuide;
    }), function(value) {
      if (value) {
        $scope.tvGuide = TvGuide.channelTvGuide;
        $scope.currentShow = TvGuide.getCurrentShow($scope.tvGuide.channels[0].programs);
        $scope.nextShows = TvGuide.getCurrentShow($scope.tvGuide.channels[0].programs, $scope.nextLimit);
        if($scope.tvGuide.channels[0].capture != null){
          $scope.capture = $scope.tvGuide.channels[0].capture;
        } else {
          $scope.capture = 'img/default.jpg';
        }
        $scope.loaded = true;
      }
    });
  });

});
