angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'pascalprecht.translate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('tab.channels', {
      url: '/channels',
      views: {
        'tab-channels': {
          templateUrl: 'templates/tab-channels.html',
          controller: 'ChannelsCtrl'
        }
      }
    })
    .state('tab.channels-detail', {
      url: '/channels/:channelId',
      views: {
        'tab-channels': {
          templateUrl: 'templates/channels-detail.html',
          controller: 'ChannelsDetailCtrl'
        }
      }
    })

  $urlRouterProvider.otherwise('/tab/channels');

})

.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

  $translateProvider.translations('en', {
    'CHANNELS' : 'Channels',
    'SETTINGS' : 'Settings',
    'LANGUAGE' : 'Language',
    'LANG_EN' : 'English',
    'LANG_HU' : 'Hungarian',
    'NEXTLIMIT' : 'Program number',
    'PLAY' : 'Play',
    'INFO' : 'Port.hu',
    'NEXT_SHOWS' : 'Next shows',
    'TVGUIDE' : 'Tv guide'
  });

  $translateProvider.translations('hu', {
    'CHANNELS': 'Csatornák',
    'SETTINGS' : 'Beállítások',
    'LANGUAGE' : 'Nyelv',
    'LANG_EN' : 'Angol',
    'LANG_HU' : 'Magyar',
    'NEXTLIMIT' : 'Program szám',
    'PLAY' : 'Lejátszás',
    'INFO' : 'Port.hu',
    'NEXT_SHOWS' : 'Következő műsorok',
    'TVGUIDE' : 'Műsorújság'
  });

  $translateProvider.preferredLanguage('hu');
}]);
