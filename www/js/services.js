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

.service('TvGuide', ['$http', function($http) {

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

}]);
