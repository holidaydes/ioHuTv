angular.module('starter.services', [])

.factory('Channels', function() {

  var channels = [{
    id: 0,
    name: 'M1',
    logo: 'img/M1.png'
  }, {
    id: 1,
    name: 'M2',
    logo: 'img/M2.png'
  }, {
    id: 2,
    name: 'M4',
    logo: 'img/M4.png'
  }, {
    id: 3,
    name: 'Duna TV',
    logo: 'img/Duna.png'
  }, {
    id: 4,
    name: 'Duna World',
    logo: 'img/DunaW.png'
  }];

  return {
    all: function() {
      return channels;
    },
    get: function(channelId) {
      for (var i = 0; i < channels.length; i++) {
        if (channels[i].id === parseInt(channelId)) {
          return channels[i];
        }
      }
      return null;
    }
  };
});
