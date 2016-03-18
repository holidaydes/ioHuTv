angular.module('starter.directives', [])

.directive('channels', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/channels.html'
  }
})

.directive('settings', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/settings.html'
  }
})

.directive('loading', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/loading.html'
  }
})

.directive('notvguide', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/noTvGuide.html'
  }
});
