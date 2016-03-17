angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate, $localstorage) {

  $scope.languagePanel = false;
  $scope.language = $localstorage.get('language');
  $scope.nextLimit = $localstorage.get('nextLimit');
  $scope.timeoutLimit = $localstorage.get('timeoutLimit');

  $scope.tvGuideIsOn = function() {
    if ($localstorage.get('tvGuideSwitch') === 'true') {
      return true;
    }
    return false;
  };

  $scope.safeModeIsOn = function() {
    if ($localstorage.get('safeMode') === 'true') {
      return true;
    }
    return false;
  };

  $scope.tvGuide = $scope.tvGuideIsOn();
  $scope.safeMode = $scope.safeModeIsOn();

  $scope.changeLanguage = function(langKey) {
    $translate.use(langKey);
    $scope.save(0, langKey);
    $scope.languagePanel = false;
  };

  $scope.save = function(type, value) {
    switch (type) {
      case 0:
        $localstorage.set('language', value);
        console.log('Language is set to ' + $localstorage.get('language'));
        $scope.language = $localstorage.get('language');
        break;
      case 1:
        $localstorage.set('tvGuideSwitch', value);
        console.log('tvGuide is set to ' + $localstorage.get('tvGuideSwitch'));
        $scope.tvGuide = $localstorage.get('tvGuideSwitch');
        break;
      case 2:
        $localstorage.set('nextLimit', value);
        console.log('Next limit is set to ' + $localstorage.get('nextLimit'));
        $scope.nextLimit = $localstorage.get('nextLimit');
        break;
      case 3:
        $localstorage.set('timeoutLimit', value);
        console.log('Timeout is set to ' + $localstorage.get('timeoutLimit'));
        $scope.timeoutLimit = $localstorage.get('timeoutLimit');
        break;
      case 4:
        $localstorage.set('safeMode', value);
        console.log('SafeMode is set to ' + $localstorage.get('safeMode'));
        $scope.safeMode = $localstorage.get('safeMode');
        break;
    }
  };

  $scope.showLanguagePanel = function() {
    if ($scope.languagePanel) {
      $scope.languagePanel = false;
    } else {
      $scope.languagePanel = true;
    }
  };

  $scope.currentLanguage = function() {
    var lang;
    switch ($scope.language) {
      case 'hu':
        lang = 'LANG_HU';
        break;
      case 'en':
        lang = 'LANG_EN';
        break;
    }
    return lang;
  };

})

.controller('ChannelsCtrl', function($scope, $localstorage, $timeout, $interval, $ionicModal, $ionicScrollDelegate, Channels, TvGuideService, TvTimeService, ImageService) {
  $scope.port;
  $scope.channels;
  $scope.port_ids = '';
  $scope.tvGuides = '';
  $scope.loaded = false;

  $ionicModal.fromTemplateUrl('templates/channelView.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(id) {
    $scope.channel = Channels.getChannel(id);
    $scope.updateChannel();
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.scrollTop();
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.getAge = function(age) {
    return ImageService.getAge(age);
  };

  $scope.tvGuideIsOn = function() {
    if ($localstorage.get('tvGuideSwitch') === 'true') {
      return true;
    }
    return false;
  };

  $scope.doRefresh = function() {
    if ($scope.tvGuideIsOn()) {
      $scope.update();
      console.log('Updated tvguide.');
      $scope.$broadcast('scroll.refreshComplete');
    } else {
      console.log('Nothing happened.');
    }
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
/*
  $scope.send = function(link) {
    window.plugins.webintent.startActivity({
        action: window.plugins.webintent.ACTION_VIEW,
        url: link,
        type: 'application/x-mpegURL'
      },
      function() {},
      function() {
        alert('Failed to open URL via Android Intent.');
        console.log("Failed to open URL via Android Intent.");
      }
    )
  };
*/
  $scope.getCurrentShow = function(programs) {
    if (programs != undefined) {
      return TvGuideService.getCurrentShow(programs);
    }
    return null;
  };

  $scope.getLogo = function(logo) {
    return ImageService.getLogo(logo);
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

  $scope.port = Channels.port();
  $scope.tvGuide = '';
  $scope.currentShow = '';
  $scope.nextShows = [];
  $scope.loaded = false;
  $scope.loadCapture = false;
  /*default parameters*/
  $scope.capture = null;
  /*view control parameters*/
  $scope.nextShowsPanel = false;

  $scope.getAge = function(age) {
    return ImageService.getAge(age);
  };

  $scope.getExtras = function(id) {
    return ImageService.getExtras(id);
  };
/*
  if ($scope.tvGuideIsOn()) {
    $scope.$on('$ionicView.enter', function(e) {
      $scope.update();
      $scope.$watch(angular.bind(TvTimeService, function() {
        return TvTimeService.getCurrentTime();
      }), function(value) {
        if ($scope.loaded) {
          var endTime = TvTimeService.getTime($scope.currentShow.end_time);
          if (value >= 2400 && endTime < 1000) {
            endTime += 2400;
          }
          if (value > endTime) {
            $scope.update();
            console.log('Program was changed.');
          }
        }
      });
    });
  } else {
    $scope.loaded = true;
  }
*/
  $scope.send = function(link) {
    window.plugins.webintent.startActivity({
        action: window.plugins.webintent.ACTION_VIEW,
        url: link,
        type: 'application/x-mpegURL'
      },
      function() {},
      function() {
        alert('Failed to open URL via Android Intent.');
        console.log("Failed to open URL via Android Intent.");
      }
    )
  };

  $scope.updateChannel = function() {
    TvGuideService.getTvGuide($scope.port, $scope.channel.port_id, TvTimeService.getDate());
    console.log('Query ' + $scope.channel.title + ' programs.');
    $scope.$watch(angular.bind(TvGuideService, function() {
      return TvGuideService.channelTvGuide;
    }), function(value) {
      if (value) {
        $scope.tvGuide = TvGuideService.channelTvGuide;
        $scope.currentShow = TvGuideService.getCurrentShow($scope.tvGuide.channels[0].programs);
        $scope.nextShows = TvGuideService.getNextShows($scope.tvGuide.channels[0].programs, $localstorage.get('nextLimit'));
        $scope.loaded = true;
        $scope.capture = ImageService.getCapture($scope.tvGuide.channels[0].capture);
        $scope.loadCapture = true;
        $scope.progressval = $scope.getProgressValue($scope.currentShow.start_time, TvTimeService.getCurrentTime());
        $scope.currentShowEndTime = $scope.getProgressDuration($scope.currentShow.start_time, $scope.currentShow.end_time);
        startprogress();
      }
      $timeout(function() {
        $scope.loaded = true;
        $scope.progressval = $scope.getProgressValue($scope.currentShow.start_time, TvTimeService.getCurrentTime());
        $scope.currentShowEndTime = $scope.getProgressDuration($scope.currentShow.start_time, $scope.currentShow.end_time);
        startprogress();
      }, $localstorage.get('timeoutLimit'));
    });
  };

  $scope.getProgressDuration = function(start, end) {
    return TvTimeService.getCurrentProgressMax(start, end);
  };

  $scope.getProgressValue = function(start, currentTime) {
    return TvTimeService.getCurrentProgress(start, currentTime);
  };

  $scope.stopinterval = null;

  function startprogress() {
    if ($scope.stopinterval) {
      $interval.cancel($scope.stopinterval);
    }

    $scope.stopinterval = $interval(function() {
      $scope.progressval = $scope.getProgressValue($scope.currentShow.start_time, TvTimeService.getCurrentTime());
      if ($scope.progressval >= $scope.currentShowEndTime) {
        $interval.cancel($scope.stopinterval);
        return;
      }
    }, 1000);
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };

  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom(true);
  };

});
