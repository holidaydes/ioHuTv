angular.module('starter.services', [])

.factory('Channels', function($http) {

  var vm = this;
  vm.channels = null;

  $http.get('/resource/channels.json').then(function(resp) {
    vm.channels = resp.data;
  }, function(err) {
    console.error('ERR', err);
  });

  return {
    all: function() {
      return vm.channels;
    },
    get: function(channelId) {
      for (var i = 0; i < vm.channels.length; i++) {
        if (vm.channels[i].id === parseInt(channelId)) {
          return vm.channels[i];
        }
      }
      return null;
    }
  };
});
