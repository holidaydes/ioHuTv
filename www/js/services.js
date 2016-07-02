angular.module('starter.services', [])

.factory('Channels', function($http) {
  var vm = this;

  vm.data = {};

  var url = "";
  if (ionic.Platform.isAndroid()) {
    url = /*"/resource/channels.json"; */ = "/android_asset/www/resource/channels.json";
  } else {
    url = "/resource/channels.json";
  }

  $http.get(url).then(function(resp) {
    vm.data = resp.data;
  }, function(err) {
    console.error('ERR', err);
  });

  return {
    channels: function() {
      return vm.data.channels;
    },
    port: function() {
      return vm.data.port;
    },
    getChannel: function(channelId) {
      for (var i = 0; i < vm.data.channels.length; i++) {
        if (vm.data.channels[i].id === parseInt(channelId)) {
          return vm.data.channels[i];
        }
      }
      return null;
    }
  };
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.service('TvGuideService', ['$http', '$localstorage', 'TvTimeService', function($http, $localstorage, TvTimeService) {

  var vm = this;

  vm.getTvGuide = function(port, port_id) {
    var date = TvTimeService.getDate();
    var url = port + port_id + '&i_portdate=' + date;
    //$http.get('/resource/port.json').then(function(resp) {
    return $http({
      method: 'GET',
      url: url
    });
  };

  vm.getTvGuides = function(port, port_ids) {
    var date = TvTimeService.getDate();
    var url = port + port_ids + '&i_portdate=' + date;
    //$http.get('/resource/port_minden.json').then(function(resp) {
    return $http({
      method: 'GET',
      url: url
    });
  };

  vm.getCurrentShow = function(programs) {
    return programs[vm.getShowIterator(programs)];
  };

  vm.getNextShow = function(programs) {
    return programs[vm.getShowIterator(programs) + 1];
  };

  vm.getShowIterator = function(programs) {
    for (var i = 0; i < programs.length; i++) {
      if (programs[i].is_live) {
        return i;
      }
    }
  };

}])

.service('TvTimeService', [function() {
  var vm = this;

  vm.getDate = function() {
    var date = new Date();
    if (vm.isDayEnd()) {
      date.setDate(date.getDate() - 1);
    }
    var year = date.getFullYear();
    var month = ((date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
    var day = ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate());
    return year + '-' + month + '-' + day;
  };

  vm.getHours = function() {
    var date = new Date();
    var hours = ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours());

    if (angular.equals(hours, '00')) {
      hours = 24;
    }
    if (angular.equals(hours.toString().substring(0, 1), '0')) {
      hours = hours.toString().substring(1);
    }

    return hours;
  };

  vm.getMinutes = function() {
    var date = new Date();
    var minutes = ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes());
    return minutes;
  };

  vm.getCurrentTime = function() {
    return vm.getHours() + '' + vm.getMinutes();
  };

  vm.getTime = function(time) {
    var hours = time.toString().substring(0, 2);
    var minutes = time.toString().substring(3);

    if (angular.equals(hours, '00')) {
      hours = 24;
    }
    if (angular.equals(hours.toString().substring(0, 1), '0')) {
      hours = hours.toString().substring(1);
    }

    return hours + '' + minutes;
  };

  vm.getHourForProgress = function(time) {
    if (time < 1000) {
      return time.toString().substring(0, 1);
    } else {
      return time.toString().substring(0, 2);
    }
  };

  vm.getMinuteForProgress = function(time) {
    if (time < 1000) {
      return time.toString().substring(1);
    } else {
      return time.toString().substring(2);
    }
  };

  vm.getDuration = function(startHour, startMinutes, endHour, endMinutes) {
    var progressMax = 0;
    if (angular.equals(startHour, 24)) {
      startHour = 0;
    }
    if (angular.equals(startMinutes.toString().substring(0, 1), '0')) {
      startMinutes = startMinutes.toString().substring(1);
    }
    if (angular.equals(endMinutes.toString().substring(0, 1), '0')) {
      endMinutes = endMinutes.toString().substring(1);
    }
    progressMax = (parseInt(endHour) * 60 + parseInt(endMinutes)) - (parseInt(startHour) * 60 + parseInt(startMinutes));
    if (progressMax < 0) {
      progressMax += 1440;
    }
    return progressMax;
  };

  vm.getCurrentProgress = function(start_time, current_time) {
    var startHour = vm.getHourForProgress(vm.getTime(start_time));
    var endHour = vm.getHourForProgress(current_time);
    var startMinutes = vm.getMinuteForProgress(vm.getTime(start_time));
    var endMinutes = vm.getMinuteForProgress(current_time);

    var current = vm.getDuration(startHour, startMinutes, endHour, endMinutes);
    return current;
  };

  vm.getCurrentProgressMax = function(start_time, end_time) {
    var start = vm.getTime(start_time);
    var end = vm.getTime(end_time);
    var startHour = vm.getHourForProgress(start);
    var endHour = vm.getHourForProgress(end);
    var startMinutes = vm.getMinuteForProgress(start);
    var endMinutes = vm.getMinuteForProgress(end);

    return vm.getDuration(startHour, startMinutes, endHour, endMinutes);
  };

  vm.isDayEnd = function() {
    var currentTime = vm.getCurrentTime();
    if (currentTime >= 2400 || currentTime < 500) {
      console.log('End of the day.');
      return true;
    }
    return false;
  };

}])

.service('ImageService', function($http) {
  var vm = this;

  vm.getAge = function(age) {
    switch (age) {
      case 2:
        return 'img/age/parental_guidance_age_icon_mobil.png';
        break;
      case 3:
        return 'img/age/12_age_icon_mobil.png';
        break;
      case 5:
        return 'img/age/16_age_icon_mobil.png';
        break;
      case 6:
        return 'img/age/18_age_icon_mobil.png';
        break;
      case 7:
        return 'img/age/15_age_icon_mobil.png';
        break;
      case 10:
        return 'img/age/6_age_icon_mobil.png';
        break;
      default:
        return null;
    }
  };

  vm.getExtras = function(attributeId) {
    attributeId = parseInt(attributeId);
    switch (attributeId) {
      case 1:
        return 'img/extras/icons_hd.png';
        break;
      case 2:
        return 'img/extras/icons_deaf.png';
        break;
      default:
        return null;
    }
  };

  vm.getCapture = function(url) {
    if (!url) {
      return 'img/default.jpg';
    }
    return url;
  };

  vm.getLogo = function(logo) {
    if (!logo) {
      return 'img/default_logo.png';
    }
    return logo;
  };

})

.service('ThemeService', function($localstorage) {
  var vm = this;

  vm.themes = ['light', 'stable', 'positive', 'calm', 'balanced', 'energized', 'assertive', 'royal', 'dark'];

  vm.getTheme = function(element) {
    var theme = $localstorage.get('theme');
    switch (element) {
      case 'bar':
        return 'bar-' + theme;
        break;
      case 'range':
        return 'range-' + theme;
        break;
      case 'toggle':
        return 'toggle-' + theme;
        break;
      case 'spinner':
        return 'spinner-' + theme;
        break;
      case 'button':
        return 'button-' + theme;
        break;
      default:
    }
  };

});
