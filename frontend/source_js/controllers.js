var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('HomeController', ['$scope' , '$window', 'Users', 'Login', function($scope, $window, Users, Login) {
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

    $scope.signup = function(){
       Users.post($scope.signup_name, $scope.signup_email, $scope.signup_password)
            .then(function(response){
                  // console.log(response);
                  if(response.status == 500)
                    $scope.signup_response = 'Email already exists in the data base';
                  else
                    $scope.signup_response = response.data.message;
                  $scope.signup_name = "";
                  $scope.signup_email = "";
                  $scope.signup_password = "";
                  $('#signup_response').addClass('responded');
                  $('.signup_Form').toggleClass('extended');
                  setTimeout(function(){
                    $('#signup_response').removeClass('responded'); //change large-8 to large-12 or vice versa
                  },5000);
            })
    }
    $scope.login = function(){
      Login.post($scope.login_email, $scope.login_password)
           .then(function(response){
            console.log(response);
                if(response.status == 401)
                  $scope.signup_response = 'Incorrect email and password combination';
                else 
                  $scope.signup_response = 'Login successful!';
                $('#signup_response').addClass('responded');
                setTimeout(function(){
                  $('#signup_response').removeClass('responded'); //change large-8 to large-12 or vice versa
                },5000);
           })
    }


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



mp4Controllers.controller('AutoScheduleController', ['$scope', '$http', 'Schedules', '$window' , function($scope, $http, Schedules, $window) {

/*  Classes.getBySemester().success(function(data){
    $scope.classes = data.data;
  });
*/
  // Need to get all classes for the selected semester

  $scope.schedule = { 'name': 'My First Schedule', 'id':666, 'preview': 'preview' };
  $scope.autoSchedule = function(){

  };

}]);




mp4Controllers.controller('EditScheduleController', ['$scope', '$http', 'Schedules', '$window' , function($scope, $http, Schedules, $window) {

/*  Classes.getBySemester().success(function(data){
    $scope.classes = data.data;
  });
*/
  // Need to get all classes for the selected semester

  $scope.class = '';
  $scope.schedule = { 'name': 'My First Schedule' };


  $scope.toggleCalendar = function(){
    console.log('gonna expand calendar now');
    $('.calendar').toggleClass('large-8 large-12'); //change large-8 to large-12 or vice versa
    //find calendar div
    //expand it to span all 12 columns
  };


}]);




