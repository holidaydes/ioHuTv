angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate, $localstorage) {
  $scope.changeLanguage = function(langKey) {
    $translate.use(langKey);
  };

  $scope.nextLimit = $localstorage.get('nextLimit');
  $scope.tvGuide = $localstorage.get('tvGuideSwitch');
  $scope.timeoutLimit = $localstorage.get('timeoutLimit');

  $scope.save = function(type, value) {
    if (type === 0) {
      $localstorage.set('nextLimit', value);
      console.log('Next limit is set to ' + $localstorage.get('nextLimit'));
    }
    if (type === 1) {
      $localstorage.set('tvGuideSwitch', value);
      console.log('tvGuide is set to ' + $localstorage.get('tvGuideSwitch'));
    }
    if (type === 2) {
      $localstorage.set('language', value);
      console.log('Language is set to ' + $localstorage.get('language'));
    }
    if (type === 3) {
      $localstorage.set('timeoutLimit', value);
      console.log('Timeout is set to ' + $localstorage.get('timeoutLimit'));
    }
  };
})

.controller('ChannelsCtrl', function($scope, $localstorage, $timeout, Channels, TvGuideService, TvTimeService, ExtrasService) {
  $scope.port;
  $scope.channels;
  $scope.port_ids = '';
  $scope.tvGuides = '';
  $scope.loaded = false;
  /*default parameters*/
  $scope.default_logo = 'img/default_logo.gif';

  $scope.getAge = function(age){
    return ExtrasService.getAge(age);
  };

  $scope.tvGuideIsOn = function() {
    if ($localstorage.get('tvGuideSwitch') === 'true') {
      return true;
    }
    return false;
  };

  $scope.$on('$ionicView.enter', function(e) {
    if ($scope.tvGuideIsOn()) {
      $scope.update();
    } else {
      $scope.loaded = true;
    }
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
      return TvGuideService.getCurrentShow(programs);
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

  $scope.update = function() {
    TvGuideService.getTvGuides($scope.port, $scope.port_ids, TvTimeService.getDate());
    console.log('Query tv guides');
    $scope.$watch(angular.bind(TvGuideService, function() {
      return TvGuideService.channelTvGuides;
    }), function(value) {
      if (value) {
        $scope.tvGuides = TvGuideService.channelTvGuides;
        $scope.loaded = true;
      }
      $timeout(function() {
        $scope.loaded = true;
      }, $localstorage.get('timeoutLimit'));
    });
  };
})

.controller('ChannelsDetailCtrl', function($scope, $localstorage, $timeout, $stateParams, $interval, Channels, TvGuideService, TvTimeService, ExtrasService) {
  $scope.port = Channels.port();
  $scope.channel = Channels.getChannel($stateParams.channelId);
  $scope.tvGuide = '';
  $scope.currentShow = '';
  $scope.nextShows = [];
  $scope.loaded = false;
  /*default parameters*/
  $scope.capture = 'img/default.jpg';
  /*view control parameters*/
  $scope.nextShowsPanel = false;

  $scope.tvGuideIsOn = function() {
    if ($localstorage.get('tvGuideSwitch') === 'true') {
      return true;
    }
    return false;
  };

  $scope.getAge = function(age){
    return ExtrasService.getAge(age);
  };

  if ($scope.tvGuideIsOn()) {
    $scope.$on('$ionicView.enter', function(e) {
      $scope.update();
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

  $scope.update = function() {
    TvGuideService.getTvGuide($scope.port, $scope.channel.port_id, TvTimeService.getDate());
    console.log('Query ' + $scope.channel.title + ' programs.');
    $scope.$watch(angular.bind(TvGuideService, function() {
      return TvGuideService.channelTvGuide;
    }), function(value) {
      if (value) {
        $scope.tvGuide = TvGuideService.channelTvGuide;
        $scope.currentShow = TvGuideService.getCurrentShow($scope.tvGuide.channels[0].programs);
        $scope.nextShows = TvGuideService.getNextShows($scope.tvGuide.channels[0].programs, $localstorage.get('nextLimit'));
        if ($scope.tvGuide.channels[0].capture != null) {
          $scope.capture = $scope.tvGuide.channels[0].capture;
        } else {
          $scope.capture = 'img/default.jpg';
        }
        $scope.loaded = true;
        $scope.progressval = $scope.getProgressValue($scope.currentShow.start_time, TvTimeService.getHours() + '' + TvTimeService.getMinutes());
        $scope.currentShowEndTime = $scope.getProgressDuration($scope.currentShow.start_time, $scope.currentShow.end_time);
        startprogress();
      }
      $timeout(function() {
        $scope.loaded = true;
        $scope.progressval = $scope.getProgressValue($scope.currentShow.start_time, TvTimeService.getHours() + '' + TvTimeService.getMinutes());
        $scope.currentShowEndTime = $scope.getProgressDuration($scope.currentShow.start_time, $scope.currentShow.end_time);
        startprogress();
      }, $localstorage.get('timeoutLimit'));
    });
  };

  $scope.getProgressDuration = function(start, end){
    return TvTimeService.getCurrentProgressMax(start, end);
  };

  $scope.getProgressValue = function(start, currentTime){
    return TvTimeService.getCurrentProgress(start, currentTime);
  };

  $scope.stopinterval = null;

  function startprogress() {
    if ($scope.stopinterval) {
      $interval.cancel($scope.stopinterval);
    }

    $scope.stopinterval = $interval(function() {
      $scope.progressval = $scope.getProgressValue($scope.currentShow.start_time, TvTimeService.getHours() + '' + TvTimeService.getMinutes());
      if ($scope.progressval >= $scope.currentShowEndTime) {
        $interval.cancel($scope.stopinterval);
        return;
      }
    }, 1000);
  };

});
