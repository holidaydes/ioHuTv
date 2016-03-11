angular.module('starter.directives', [])

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
