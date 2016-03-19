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

.config(['$translateProvider', function($translateProvider) {
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

  $translateProvider.translations('en', {
    'CHANNELS': 'Channels',
    'SETTINGS': 'Settings',
    'LANGUAGE': 'Language',
    'LANG_EN': 'English',
    'LANG_HU': 'Hungarian',
    'PLAY': 'Play',
    'INFO': 'Info',
    'NEXT_SHOWS': 'Next show',
    'TVGUIDE': 'Tv guide',
    'TIMEOUT': 'Timeout',
    'REFRESH': 'Pull to refresh...',
    'SAFEMODE': 'Safe mode',
    'CLOSE': 'Close'
  });

  $translateProvider.translations('hu', {
    'CHANNELS': 'Csatornák',
    'SETTINGS': 'Beállítások',
    'LANGUAGE': 'Nyelv',
    'LANG_EN': 'Angol',
    'LANG_HU': 'Magyar',
    'PLAY': 'Lejátszás',
    'INFO': 'Info',
    'NEXT_SHOWS': 'Következő műsor',
    'TVGUIDE': 'Műsorújság',
    'TIMEOUT': 'Idő túl lépés',
    'REFRESH': 'Húzza le a frissítéshez...',
    'SAFEMODE': 'Biztonsági mód',
    'CLOSE': 'Bezár'
  });
  //$translateProvider.preferredLanguage('hu');
}])

.run(function($localstorage, $translate) {
  $localstorage.set('language', 'hu');
  $localstorage.set('tvGuideSwitch', true);
  $localstorage.set('timeoutLimit', 5000);
  $localstorage.set('safeMode', false);

  $translate.use($localstorage.get('language'));
});
