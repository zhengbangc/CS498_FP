var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'HomeController'
  }).
  when('/createschedule', {
    templateUrl: 'partials/createschedule.html',
    controller: 'CreateController'
  }).
  when('/myschedules', {
    templateUrl: 'partials/myschedules.html',
    controller: 'MySchedulesController'
  }).
  when('/scheduledetail', {
    templateUrl: 'partials/scheduledetail.html',
    controller: 'ScheduleDetailController'
  }).
  otherwise({
    redirectTo: '/home'
  });
}]);
