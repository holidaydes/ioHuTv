angular.module('starter.services', [])

.factory('Channels', function($http) {
  var vm = this;

  vm.data = {};

  $http.get('/resource/channels.json').then(function(resp) {
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

.service('TvGuide', ['$http', 'TvTime', function($http, TvTime) {

  var vm = this;
  vm.channelTvGuide;
  vm.channelsTvGuide;

  vm.getTvGuide = function(port, port_id, date) {
    var url = port + port_id + '&i_portdate=' + date;
    $http.get(url).then(function(resp) {
      vm.channelTvGuide = resp.data;
    }, function(err) {
      console.error('ERR', err);
    });
  };

  vm.getTvGuides = function(port, port_ids, date) {
    var url = port + port_ids + '&i_portdate=' + date;
    $http.get(url).then(function(resp) {
      vm.channelTvGuides = resp.data;
    }, function(err) {
      console.error('ERR', err);
    });
  };

  vm.getCurrentShow = function(programs) {
    vm.currentShow = '';
    var currentTime = TvTime.getHours() + '' + TvTime.getMinutes();

    for (var i = 0; i < programs.length; i++) {
      if (TvTime.getTime(programs[i].start_time) <= currentTime && TvTime.getTime(programs[i].end_time) >= currentTime) {
        vm.currentShow = programs[i];
        break;
      }
    }

    return vm.currentShow;
  };

  vm.getNextShows = function(programs, amount) {
    vm.next = [];
    var currentTime = TvTime.getHours() + '' + TvTime.getMinutes();

    for (var i = 0; i < programs.length; i++) {
      if (TvTime.getTime(programs[i].start_time) <= currentTime && TvTime.getTime(programs[i].end_time) >= currentTime) {
        vm.next.push(programs[i]);
        for (var j = 1; j <= amount; j++) {
          if ((i + j) != programs.length) {
            vm.next.push(programs[i + j]);
          }
        }
        break;
      }
    }

    return vm.next;
  };

}])

.service('TvTime', [function() {
  var vm = this;

  vm.getDate = function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ((date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
    var day = ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate());
    return year + '-' + month + '-' + day;
  };

  vm.getHours = function() {
    var date = new Date();
    var hours = ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours());
    return hours;
  };

  vm.getMinutes = function() {
    var date = new Date();
    var minutes = ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes());
    return minutes;
  };

  vm.getTime = function(time) {
    var hours = time.toString().substring(0, 2);
    var minutes = time.toString().substring(3);

    if (hours === '00') {
      hours = 24;
    }
    if (hours.toString().substring(0, 1) === '0') {
      hours = hours.toString().substring(1);
    }

    return hours + '' + minutes;
  };
}]);
