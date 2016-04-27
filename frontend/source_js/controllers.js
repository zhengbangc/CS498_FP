var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };

}]);


mp4Controllers.controller('MySchedulesController', ['$scope', '$http', 'Schedules', '$window' , function($scope, $http, Schedules, $window) {

/*  Schedules.getByUser(user.id).success(function(data){
    $scope.schedules = data.data;
  });
*/
  // Need to get all schedules that have "user":[this user] --- assuming we can query with "?where={id:user.id}" in http requests in services.js

  $scope.schedules = [ 
    { 'id': 1000, name: 'My schedule 1', 'user': 1, 'classes': ['c1','c2','c3'], 'sections': ['s1','s2','s3'], 'semester': 'Fall 2016' }, 
    { 'id': 1001, name: 'My schedule 2', 'user': 1, 'classes': ['c1','c2','c3'], 'sections': ['s1','s2','s3'], 'semester': 'Spring 2016' },
    { 'id': 1002, name: 'My schedule 3', 'user': 1, 'classes': ['c1','c2','c3'], 'sections': ['s1','s2','s3'], 'semester': 'Fall 2016' },
    { 'id': 1003, name: 'My schedule 4', 'user': 1, 'classes': ['c1','c2','c3'], 'sections': ['s1','s2','s3'], 'semester': 'Fall 2015' },
    { 'id': 1004, name: 'My schedule 5', 'user': 1, 'classes': ['c1','c2','c3'], 'sections': ['s1','s2','s3'], 'semester': 'Fall 2015' },
    { 'id': 1005, name: 'My schedule 6', 'user': 1, 'classes': ['c1','c2','c3'], 'sections': ['s1','s2','s3'], 'semester': 'Fall 2016' }, 
    { 'id': 1006, name: 'My schedule 7', 'user': 1, 'classes': ['c1','c2','c3'], 'sections': ['s1','s2','s3'], 'semester': 'Fall 2016' }  
    ];
  $scope.semesters = [ 'Fall 2016', 'Spring 2016', 'Fall 2015', 'Spring 2015']; 
  $scope.user = { 'id': 1, 'name': 'Maggie Smith' };

}]);

mp4Controllers.controller('CreateScheduleController', ['$scope', '$http', 'Schedules', '$window' , function($scope, $http, Schedules, $window) {

/*  Classes.getBySemester().success(function(data){
    $scope.classes = data.data;
  });
*/
  // Need to get all classes for the selected semester

  $scope.schedule_title;

  $scope.autoSchedule = function(){

  };

}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);

mp4Controllers.controller('HomeController', ['$scope' , '$window' , function($scope, $window) {
    $scope.open_body = function(){
      $('.body_container').addClass('open');
      $('.home_container button').addClass('open');
    }
    $scope.open_loginForm = function(){
       $('.login_Form').toggleClass('extended');
    }
    $scope.close_loginForm = function(){
      $('.login_Form').toggleClass('extended');
    }
    $scope.open_signupForm = function(){
      $('.signup_Form').toggleClass('extended');
    }
    $scope.close_signupForm = function(){
      $('.signup_Form').toggleClass('extended'); 
    }
}]);