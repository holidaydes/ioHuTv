angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate) {
  $scope.changeLanguage = function(langKey) {
    $translate.use(langKey);
  };
  $scope.nextLimit = 3;
  $scope.tvGuide = true;
})

.controller('ChannelsCtrl', function($scope, $timeout, Channels, TvGuide, TvTime) {
  $scope.port;
  $scope.channels;
  $scope.port_ids = '';
  $scope.tvGuides = '';
  $scope.loaded = false;
  $scope.tvGuide = true;
  /*default parameters*/
  $scope.default_logo = 'img/default_logo.gif';

  if ($scope.tvGuide) {
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
        $timeout(function() {
          $scope.loaded = true;
        }, 5000);
      });
    });
  } else {
    $scope.loaded = true;
  }

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

  $scope.getLogo = function(id) {
    var logo;
    if ($scope.tvGuides != '') {
      if ($scope.tvGuides.channels[id].logo != null) {
        logo = $scope.tvGuides.channels[id].logo;
      }
    } else {
      logo = $scope.default_logo;
    }
    return logo;
  };

})

.controller('ChannelsDetailCtrl', function($scope, $timeout, $stateParams, Channels, TvGuide, TvTime) {
  $scope.port = Channels.port();
  $scope.port_default = Channels.port_default();
  $scope.channel = Channels.getChannel($stateParams.channelId);
  $scope.tvGuide = '';
  $scope.currentShow = '';
  $scope.nextShows = [];
  $scope.loaded = false;
  /*default parameters*/
  $scope.capture = 'img/default.jpg';
  $scope.film_url = $scope.port_default;
  $scope.nextLimit = 10;
  $scope.tvGuide2 = true;
  /*view control parameters*/
  $scope.nextShowsPanel = false;

  if ($scope.tvGuide2) {
    $scope.$on('$ionicView.enter', function(e) {
      TvGuide.getTvGuide($scope.port, $scope.channel.port_id, TvTime.getDate());
      console.log('Query ' + $scope.channel.title + ' programs.');
      $scope.$watch(angular.bind(TvGuide, function() {
        return TvGuide.channelTvGuide;
      }), function(value) {
        if (value) {
          $scope.tvGuide = TvGuide.channelTvGuide;
          $scope.currentShow = TvGuide.getCurrentShow($scope.tvGuide.channels[0].programs);
          $scope.nextShows = TvGuide.getNextShows($scope.tvGuide.channels[0].programs, $scope.nextLimit);
          if ($scope.tvGuide.channels[0].capture != null) {
            $scope.capture = $scope.tvGuide.channels[0].capture;
          } else {
            $scope.capture = 'img/default.jpg';
          }
          if ($scope.currentShow.film_url != null) {
            $scope.film_url = $scope.currentShow.film_url;
          } else {
            $scope.film_url = $scope.port_default;
          }
          $scope.loaded = true;
        }
        $timeout(function() {
          $scope.loaded = true;
        }, 5000);
      });
    });
  } else {
    $scope.loaded = true;
  }

  $scope.nextShowsPanelToggle = function() {
    if ($scope.nextShowsPanel) {
      $scope.nextShowsPanel = false;
    } else {
      $scope.nextShowsPanel = true;
    }
  };

});
