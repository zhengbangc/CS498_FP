var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('HomeController', ['$scope' , '$window', 'Users', 'Login', function($scope, $window, Users, Login) {
  if(Users.isAuthed() == true) {
    $window.location.href = '#/myschedules';
  }

  $scope.open_body = function(){
    $('.body_container').addClass('open');
    $('.home_container button').addClass('open');
  };
  $scope.open_loginForm = function(){
    $('.login_Form').toggleClass('extended');
  };
  $scope.close_loginForm = function(){
    $('.login_Form').toggleClass('extended');
  };
  $scope.open_signupForm = function(){
    $('.signup_Form').toggleClass('extended');
  };
  $scope.close_signupForm = function(){
    $('.signup_Form').toggleClass('extended'); 
  };

  $scope.signup = function(){
    Users.post($scope.signup_name, $scope.signup_email, $scope.signup_password)
    .then(function(response){
      // console.log(response);
      if(response.status == 500)
        $scope.signup_response = 'Email already exists in the data base';
      else{
        $scope.signup_response = response.data.message;
        $window.sessionStorage['jwtToken'] = response.data.data.token;
        setTimeout(function(){
          $window.location.href = '#/myschedules';
        },1000);
      }
      $scope.signup_name = "";
      $scope.signup_email = "";
      $scope.signup_password = "";
      $('#signup_response').addClass('responded');
      $('.signup_Form').toggleClass('extended')
      setTimeout(function(){
        $('#signup_response').removeClass('responded'); //change large-8 to large-12 or vice versa
      },5000);
    });
  };

  $scope.login = function(){
    Login.post($scope.login_email, $scope.login_password)
    .then(function(response){
      console.log(response);
      if(response.status == 401){
        $scope.signup_response = 'Incorrect email and password combination';
        $('#signup_response').addClass('responded');
        setTimeout(function(){
                  $('#signup_response').removeClass('responded'); //change large-8 to large-12 or vice versa
                },5000);
      }
      else{
        $scope.signup_response = 'Login successful!';
        $('#signup_response').addClass('responded');
        $window.sessionStorage['jwtToken'] = response.data.token;
        $window.sessionStorage['userpw'] = $scope.login_password;
        Users.get().then(function(response){
          console.log(response.data);
        });
        setTimeout(function(){
          $window.location.href = '#/myschedules';
        },1000);
      }

    });
  };

  $(".signup_Form").bind("keypress", function(e) {
    if (e.keyCode == 13) {
      return false;
    }
  });
}]);



mp4Controllers.controller('MySchedulesController', ['$scope', '$http', 'Schedules', 'Users', '$window' , function($scope, $http, Schedules, Users, $window) {
  if(Users.isAuthed() == false)
    $window.location.href = '#/home';
  else {
    Users.get().then(function(response){
      if(response.status == 200){
        $scope.user = response.data.data;
      }
      else
        $window.location.href = '#/home';
    });
  }

  // Need to get all schedules that have "user":[this user] --- assuming we can query with "?where={id:user.id}" in http requests in services.js
  $scope.semesters = [];
  $scope.schedules = [];
  Users.get().then(function(response){
    var schedules = response.data.data.schedules;
    schedules.forEach(function(element){
      $scope.schedules.push({'id':element.id, 'name': element.name, 'semester': element.term});
      if($scope.semesters.indexOf(element.term) == -1)
        $scope.semesters.push(element.term);
    })
  })

  $scope.logout = function(){
    $window.sessionStorage.removeItem('jwtToken');
    $window.sessionStorage.removeItem('userpw');
    $window.location.href = '#/home';
  }
}]);

mp4Controllers.controller('EditUserController', ['$scope','$http','$window', 'Users', function($scope, $http, $window,Users){
  if(Users.isAuthed() == false)
    $window.location.href = '#/home';
  else {
    Users.get().then(function(response){
      if(response.status == 200)
        $scope.user = response.data.data;
      else
        $window.location.href = '#/home';
    });
  }

  $scope.updateUser = function (){
    //TODO: get the current user and get the schedule array!
    Users.updateUser($scope.user.name, $scope.user.email, $scope.user_password)
    .then(function(response){
      if(response.status == 200){
        Users.get().then(function(response){
          if(response.status == 200){
            console.log(response.data.data);
            $scope.user = response.data.data;
          } else {
            $window.location.href = '#/home';
          }

          $scope.edit_response = "Edit user successful";
          $('#edituser_response').toggleClass('responded');
          setTimeout(function(){
            $('#edituser_response').toggleClass('responded');
          }, 3000);
        });
      } else {
        $scope.edit_response = "Edit user fail";
        $('#edituser_response').toggleClass('responded');
        setTimeout(function(){
          $('#edituser_response').toggleClass('responded');
        }, 3000);
      }
    });
  };

  $scope.close = function(){
    $window.location.href = '#/myschedules';
  };


  $scope.logout = function(){
    $window.sessionStorage.removeItem('jwtToken');
    $window.sessionStorage.removeItem('userpw');
    $window.location.href = '#/home';
  };
}]);

mp4Controllers.controller('CreateScheduleController', ['$scope', '$http', 'Schedules', 'Users', '$window' , function($scope, $http, Schedules, Users, $window) {
  //Check if there is an authenticated user
  if(Users.isAuthed() == false)
    $window.location.href = '#/home';
  else {
    Users.get().then(function(response){
      if(response.status == 200)
        $scope.user = response.data.data;
      else
        $window.location.href = '#/home';
    });
  }

  $scope.created = false;
  $scope.semester = 'Spring 2016';
  $scope.createSchedule = function (){
    Schedules.add($scope.schedule_name, $scope.semester)
    .then(function(response){
      console.log(response.status);
      if(response.status == 500) {
        $scope.createschedule_response = 'Schedule could not be created';
      } else {
        //$scope.createschedule_response = response.data.message;
        $scope.createschedule_response = 'Schedule created';
        $scope.created = true;
        console.log(response.data.data);
        $scope.id = response.data.data.id;
      }
      $('#createschedule_response').toggleClass('responded');
      setTimeout(function(){
        $('#createschedule_response').toggleClass('responded');
      }, 5000);
    });
  };

  $scope.logout = function(){
    $window.sessionStorage.removeItem('jwtToken');
    $window.sessionStorage.removeItem('userpw');
    $window.location.href = '#/home';
  };

}]);


mp4Controllers.controller('EditScheduleController', 
['$scope', '$http', 'Schedules','Classes', 'Users', 'Sections', '$window','$routeParams', 
function($scope, $http, Schedules, Classes, Users, Sections, $window, $routeParams) {

  if(Users.isAuthed() == false) {
    $window.location.href = '#/home';
  } else {
    Users.get().then(function(response){
      if(response.status == 200)
        $scope.user = response.data.data;
      else
        $window.location.href = '#/home';
    });
  }

  $scope.logout = function(){
    $window.sessionStorage.removeItem('jwtToken');
    $window.sessionStorage.removeItem('userpw');
    $window.location.href = '#/home';
  }

  $(document).foundation();

  $scope.sections = [];
  $scope.activeCRNs = [];
  $scope.CRNtoOrigID = new Array();
  $scope.CRNtoClicked = new Array();
  $scope.sectionsForCalendar = [];
  $scope.classes = [];
  $scope.selectedSections = [];
  $scope.appointments = new Array();
  $scope.source ={
    dataType: "array",
    dataFields: [
    { name: 'id', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'location', type: 'string' },
    { name: 'subject', type: 'string' },
    { name: 'calendar', type: 'string' },
    { name: 'start', type: 'date' },
    { name: 'end', type: 'date' },
    { name: 'recurrenceRule', type: 'string' },
    { name: 'draggable', type: 'boolean' },
    { name: 'resizable', type: 'boolean' },
    { name: 'readOnly', type: 'boolean' },
    ],
    id: 'id',
    localData: $scope.appointments
  };
  $scope.adapter = new $.jqx.dataAdapter($scope.source);

  // GET ALL SECTIONS FROM SCHEDULE
  // get all sections ids from this schedule
  // for all sections: addSection(section), get the section's info
  Schedules.get($routeParams._id).then(function(response){
    $scope.schedule = response.data.data;
  }).then(function(){
    var sections = $scope.schedule.sections; 
    Classes.getByTerm($scope.schedule.term).then(function(response){
      $scope.classes = response.data.data;
    }).then(function(response) {
      //for each section in $scope.schedule.sections, get the section info
      for(var i=0; i<sections.length; i++){
        var rightCourse = $scope.classes.filter(function(course) {
          return sections[i]['class'] == course.id;
        });
        $scope.addSection(sections[i], (rightCourse || [{name: '(No Title)'}])[0].name);
      }
    });
  });

  $scope.selectClass = function(cur_class){
    Classes.get(cur_class.id).then(function(response){
      $scope.sections = response.data.data.Sections;
      $scope.days = ['No day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    })
  };

  $scope.selectSection = function(cur_section){
    if (cur_section.ifSelected == 'blue'){
      cur_section.ifSelected = 'notBlue';
      $scope.selectedSections = $scope.selectedSections.filter(function (el) {
        return el.crn !== cur_section.crn;
      })
    }
    else{
      cur_section.ifSelected = 'blue';
      if($scope.selectedSections.every(function(section) {
        return section.crn != cur_section.crn;
      })) {
        $scope.selectedSections.push(cur_section);
      }
    }
  };

  $scope.saveSchedule = function(){
    //for each thing in assignment, save
    $scope.schedule.sections = [];
    appointments =  $("#scheduler").jqxScheduler('getAppointments');
    for (var i=0; i<appointments.length; i++){
      var realID = parseInt($scope.CRNtoOrigID[appointments[i].description]);
      $scope.schedule.sections.push(realID);
    }
    $scope.schedule.sections = $scope.schedule.sections.filter(function(item, i, ar) { return ar.indexOf(item) === i; });
    Schedules.put($scope.schedule).then(function(response){
      console.log('Put schedule');
    });
  }

  $scope.addSection = function(sec, secname){
    if($scope.activeCRNs.every(function(crn) {
      return crn != sec.crn;
    })) {
      $scope.activeCRNs.push(sec.crn);
      var times = sec.section_times;
      // for each day that this section repeats (e.g. M,W,F,....)
      for (var i=0; times && i < times.length; i++){

        var day = times[i][0];  // 1 for monday, 2 for tuesday, etc......

        var startTime = times[i][1];
        var startHours = (startTime / 60) | 0;
        var startMinutes = (startTime % 60) | 0;

        var endTime = times[i][2];
        var endHours = (endTime / 60) | 0;
        var endMinutes = (endTime % 60) | 0;
        var newappointment = {
          id: 'id' + sec.id.toString(), //id for calendar
          description: sec.crn.toString(),  // IS THE CRN!!!!!!!!!!!
          location: sec.section_location,
          subject: secname,  // e.g. "CS440"
          start: new Date(2016, 10, 20+day, startHours, startMinutes, 0), //(year, month, day, hour, minute, second)
          end: new Date(2016, 10, 20+day, endHours, endMinutes, 0),
          calendar: "Class 3",
          resizable: false,
          draggable: false,
          readOnly: true,
        };
        $scope.CRNtoOrigID[newappointment.description] = Number.parseInt(sec.id);
        $('#scheduler').jqxScheduler('addAppointment', newappointment);
      };
    }
  };

  $scope.addSections = function (){
    $scope.selectedSections.forEach(function(element){
      Classes.get(element.class).then(function(response){
        $scope.addSection(element, response.data.data.name);
      })
    })
  };

  $("#scheduler").jqxScheduler({
    date: new $.jqx.date(2016, 11, 23),
    width: '100vw',
    height: '70vh',
    source: $scope.adapter,
    view: 'weekView',
    showLegend: false,  //bottom with colored squares
    toolbarHeight: 0,
    enableHover: false,
    timeZone: 'Central Standard Time',
    editDialogDateTimeFormatString: "MM/dd/yyyy hh:mm tt",
    ready: function () {

      // On clicking twice, delete a class
      $('#scheduler').on('appointmentClick', function (event) { 
        var args = event.args; 
        var appointment = args.appointment;
        appointments =  $("#scheduler").jqxScheduler('getAppointments');

        var crn = appointment.description;

        // On one click, make background less opaque
        if ($scope.CRNtoClicked[appointment.description] !== 1) {
          // apply to all sections that have the same crn: compare all the idToCRN[id] and check if this is their CRN
          for (var i = 0; i < appointments.length; i++) {
            if (crn === appointments[i].description) { //crn matches
              $('#scheduler').jqxScheduler('beginAppointmentsUpdate');
              $("#scheduler").jqxScheduler('setAppointmentProperty', appointments[i].id, 'background', 'gray');
              $('#scheduler').jqxScheduler('endAppointmentsUpdate');
              $scope.CRNtoClicked[appointments[i].description] = 1;
            } else {  //crn doesn't match
              // $("#scheduler").jqxScheduler('setAppointmentProperty', appointments[i].id, 'background', 'red'); 
            }
          }
        } else {
          // after the second click, make event disappear
          // apply to all sections that are linked
          for (var i = 0; i < appointments.length; i++){
              //if (idToCRN[appointments[i].id] === CRN){
              if (crn === appointments[i].description){
                $('#scheduler').jqxScheduler('deleteAppointment', appointments[i].id);
                $scope.$apply(function() {
                  $scope.activeCRNs = $scope.activeCRNs.filter(function(activeCrn) {
                    return activeCrn != crn;
                  });
                });
              }
          }
        }
      });
    },
    resources: {
      colorScheme: "scheme05",
      dataField: "calendar",
      source:  new $.jqx.dataAdapter($scope.source)
    },
    appointmentDataFields: {
      from: "start",
      to: "end",
      id: "id",
      description: "description",
      location: "location",
      subject: "subject",
      resourceId: "calendar",
      resizable: "resizable",
      draggable: "draggable",
      readOnly: "readOnly"
    },
    views: [
        { type: "weekView", showWeekends: false, timeRuler: { scaleStartHour: 8, scaleEndHour: 21 } }
    ]});
}]);