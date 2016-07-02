angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $translate, $localstorage, ThemeService) {

  $scope.languagePanel = false;
  $scope.themePanel = false;

  $scope.tvGuideSwitch;
  $scope.safeModeSwitch;
  $scope.language = $localstorage.get('language');
  $scope.currentTheme = $localstorage.get('theme');
  $scope.timeoutLimit = $localstorage.get('timeoutLimit');
  $scope.themes = ThemeService.themes;

  $scope.version = 'v0.24';

  $scope.tvGuideIsOn = function() {
    if ($localstorage.get('tvGuideSwitch') === 'true') {
      return true;
    }
    return false;
  };

  $scope.tvGuideSwitch = $scope.tvGuideIsOn();

  $scope.changeLanguage = function(langKey) {
    $translate.use(langKey);
    $scope.save(0, langKey);
    $scope.languagePanel = false;
  };

  $scope.changeTheme = function(theme) {
    $scope.save(2, theme);
    $scope.themePanel = false;
  };

  $scope.getTheme = function(element) {
    return ThemeService.getTheme(element);
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
        //$scope.tvGuideSwitch = $localstorage.get('tvGuideSwitch');
        break;
      case 2:
        $localstorage.set('theme', value);
        console.log('theme is set to ' + $localstorage.get('theme'));
        $scope.currentTheme = $localstorage.get('theme');
        break;
      case 3:
        $localstorage.set('timeoutLimit', value);
        console.log('Timeout is set to ' + $localstorage.get('timeoutLimit'));
        $scope.timeoutLimit = $localstorage.get('timeoutLimit');
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

  $scope.showThemePanel = function() {
    if ($scope.themePanel) {
      $scope.themePanel = false;
    } else {
      $scope.themePanel = true;
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

.controller('ChannelsCtrl', function($scope, $localstorage, $timeout, $interval, $ionicModal, Channels, TvGuideService, TvTimeService, ImageService, ThemeService) {
  $scope.channels;
  $scope.port_ids = '';
  $scope.tvGuides = '';
  $scope.loaded = false;
  $scope.port = Channels.port();
  $scope.tvGuide = '';
  $scope.currentShow = '';
  $scope.nextShows = [];
  $scope.loadCapture = false;
  /*default parameters*/
  $scope.capture = null;
  /*view control parameters*/
  $scope.nextShowsPanel = false;

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

  $scope.getTheme = function(element) {
    return ThemeService.getTheme(element);
  };

  $scope.$watch(angular.bind(Channels, function() {
    return Channels.channels();
  }), function(value) {
    if (value) {
      $scope.port = Channels.port();
      $scope.channels = Channels.channels();
      for (var i = 0; i < $scope.channels.length; i++) {
        $scope.port_ids += $scope.channels[i].port_id + ((!($scope.channels.length - 1)) ? '' : ',');
      }
      $scope.update();
    }
  });

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
    TvGuideService.getTvGuides($scope.port, $scope.port_ids).success(function(data) {
      $scope.tvGuides = data;
      $scope.loaded = true;
    }).error(function(data, status) {
      console.error('Error', status, data);
    }).finally(function() {
      console.log('Query tv guides');
    });

    $timeout(function() {
      $scope.loaded = true;
    }, $localstorage.get('timeoutLimit'));
  };

  $scope.getAge = function(age) {
    return ImageService.getAge(age);
  };

  $scope.getExtras = function(id) {
    return ImageService.getExtras(id);
  };

  $scope.send = function(link, contentType) {
    window.plugins.webintent.startActivity({
        action: window.plugins.webintent.ACTION_VIEW,
        url: link,
        type: contentType
      },
      function() {},
      function() {
        alert('Failed to open URL via Android Intent.');
        console.log("Failed to open URL via Android Intent.");
      }
    )
  };

  $scope.updateChannel = function() {
    TvGuideService.getTvGuide($scope.port, $scope.channel.port_id).success(function(data) {
      $scope.tvGuide = data;
      $scope.currentShow = TvGuideService.getCurrentShow($scope.tvGuide.channels[0].programs);
      $scope.nextShows = TvGuideService.getNextShow($scope.tvGuide.channels[0].programs);
      $scope.loaded = true;
      $scope.capture = ImageService.getCapture($scope.tvGuide.channels[0].capture);
      $scope.loadCapture = true;
      $scope.progressval = $scope.getProgressValue($scope.currentShow.start_time, TvTimeService.getCurrentTime());
      $scope.currentShowEndTime = $scope.getProgressDuration($scope.currentShow.start_time, $scope.currentShow.end_time);
      startprogress();
    }).error(function(data, status) {
      console.error('Error', status, data);
    }).finally(function() {
      console.log('Query ' + $scope.channel.title + ' programs.');
    });

    $timeout(function() {
      $scope.loaded = true;
      $scope.progressval = $scope.getProgressValue($scope.currentShow.start_time, TvTimeService.getCurrentTime());
      $scope.currentShowEndTime = $scope.getProgressDuration($scope.currentShow.start_time, $scope.currentShow.end_time);
      startprogress();
    }, $localstorage.get('timeoutLimit'));
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

});
