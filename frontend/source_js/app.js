var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'HomeController'
  }).
  when('/createschedule', {
    templateUrl: 'partials/createschedule.html',
    controller: 'CreateScheduleController'
  }).
  when('/myschedules', {
    templateUrl: 'partials/myschedules.html',
    controller: 'MySchedulesController'
  }).
  when('/schedule/:_id', {
    templateUrl: 'partials/editschedule.html',
    controller: 'EditScheduleController'
  }).
  when('/edituser', {
    templateUrl: 'partials/edituser.html',
    controller: 'EditUserController'
  }).
  when('/editschedule', {
    templateUrl: 'partials/editschedule.html',
    controller: 'EditScheduleController'
  }).
  when('/autoschedule', {
    templateUrl: 'partials/autoschedule.html',
    controller: 'AutoScheduleController'
  }).
  when('/testcalendar', {
    templateUrl: 'partials/TESTCALENDAR.html',
    controller: 'EditScheduleController'
  }).     
  otherwise({
    redirectTo: '/home'
  });
}]);

