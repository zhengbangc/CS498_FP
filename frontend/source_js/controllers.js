var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('HomeController', ['$scope' , '$window', 'Users', 'Login', function($scope, $window, Users, Login) {
    if(Users.isAuthed() == true)
        $window.location.href = '#/myschedules';

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
            })
    }

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
                
           })
    }

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
        Users.get().then(function(response){
          var cur_user = response.data.data;
          console.log("the schedule array in the user object is " + cur_user.schedules.toString());
          Users.updateUser($scope.user_name, $scope.user_email, $scope.user_password)
           .then(function(response){
                if(response.status == 200){
                Users.get().then(function(response){
                  if(response.status == 200){
                    console.log(response.data.data);
                    $scope.user = response.data.data;
                  }
                  else
                    $window.location.href = '#/home';

                  $scope.edit_response = "Edit user successful";
                  $('#edituser_response').toggleClass('responded');
                  setTimeout(function(){
                    $('#edituser_response').toggleClass('responded');
                  }, 3000);
                });
            }else{
                $scope.edit_response = "Edit user fail";
                $('#edituser_response').toggleClass('responded');
                setTimeout(function(){
                  $('#edituser_response').toggleClass('responded');
                }, 3000);
            }
          })

        });

    }

    $scope.close = function(){
      $window.location.href = '#/myschedules';
    }


    $scope.logout = function(){
      $window.sessionStorage.removeItem('jwtToken');
      $window.sessionStorage.removeItem('userpw');
      $window.location.href = '#/home';
    }
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
                if(response.status == 500)
                    $scope.createschedule_response = 'Create schedule failed';
                else{
                  $scope.createschedule_response = response.data.message;
                  $scope.created = true;
                  console.log(response.data.data);
                }
                $('#createschedule_response').toggleClass('responded');
                setTimeout(function(){
                  $('#createschedule_response').toggleClass('responded');
                }, 5000);

             });
  }

  $scope.logout = function(){
    $window.sessionStorage.removeItem('jwtToken');
    $window.sessionStorage.removeItem('userpw');
    $window.location.href = '#/home';
  }


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


mp4Controllers.controller('EditScheduleController', ['$scope', '$http', 'Schedules','Classes','Users','$window','$routeParams', function($scope, $http, Schedules, Classes,Users, $window, $routeParams) {

    //get all sections from this schedule


    $(document).foundation();
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

    $scope.logout = function(){
      $window.sessionStorage.removeItem('jwtToken');
      $window.sessionStorage.removeItem('userpw');
      $window.location.href = '#/home';
    }


  $scope.classes = [];
  Schedules.get($routeParams._id).then(function(response){
      console.log(response.data.data);
      $scope.schedule = response.data.data;
  }).then(function(){
      Classes.getByTerm($scope.schedule.term).then(function(response){
        // console.log(response.data.data);
        $scope.classes = response.data.data;
      })

      $scope.selectClass = function(cur_class){
        console.log(cur_class.id);
        Classes.get(cur_class.id).then(function(response){
            $scope.sections = response.data.data.Sections;
            console.log(response.data.data.Sections);
            $scope.days = ['No day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        })
      }

    })

  $scope.saveSchedule = function(){
    console.log("schedule saving");
    //for each thing in assignment, save
    $scope.schedule.sections = [];
    for (var i=0; i<appointments.length; i++){
      $scope.schedule.sections.push(appointments[i]._id);
    }
    Schedules.put($scope.schedule);
  }

  CRNtoClicked = new Array();
  // ex: CRNtoClicked['22222'] = 1;

  $scope.section = { 
    'id': 8, 
    'crn': '88888',
    'name':'CS 440 Artificial Intelligence', 
    'term': 'Fall 2016',
    'section_code': 'ADJ',
    'instructor': 'Ur Mom',
    'credit_hours': 3,
    'section_type': 'Lab',
    'class_times': [ ['M','W','F'], new Date(2016, 10, 23, 13, 0, 0), new Date(2016, 10, 23, 13, 50, 0)], 
    'class_location':'123 Sesame St',
    'restrictions': 'Pre-req: CS 225'
  };
    $scope.section2 = { 
    'id': 9, 
    'crn': '99999',
    'name':'CS 357', 
    'term': 'Fall 2016',
    'section_code': 'ADJ',
    'instructor': 'Ur Mom',
    'credit_hours': 3,
    'section_type': 'Lab',
    'class_times': [ ['M','W','F'], new Date(2016, 10, 21, 13, 0, 0), new Date(2016, 10, 21, 13, 50, 0)], 
    'class_location':'Elm St',
    'restrictions': 'Pre-req: CS 225'
  };


  // ********** CALENDAR STUFF ***************

    var appointments = new Array();

    var appointment1 = {
        id: "id1",
        description: "24100",
        location: "1404 Siebel",
        subject: "CS 241 - System Programming",
        calendar: "Class 1",
        start: new Date(2016, 10, 23, 9, 0, 0), //(year, month, day, hour, minute, second)
        end: new Date(2016, 10, 23, 9, 50, 0),
        resizable: false,
        draggable: false,
        readOnly: true
    }
    var appointment2 = {
        id: "id2",
        description: "23300",
        location: "1404 Siebel",
        subject: "CS 233 - Computer Architecture",
        calendar: "Class 2",
        start: new Date(2016, 10, 24, 10, 0, 0),
        end: new Date(2016, 10, 24, 10, 50, 0),
        resizable: false,
        draggable: false,
        readOnly: true,
        crn: '66666666'
    }
  
    appointments.push(appointment1);
    appointments.push(appointment2);

    var source =
    {
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
        localData: appointments
    };
    var adapter = new $.jqx.dataAdapter(source);
    $("#scheduler").jqxScheduler({
        date: new $.jqx.date(2016, 11, 23),
        width: '100vw',
        height: '70vh',
        source: adapter,
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
              console.log("appointment CRN = " + appointment.description);

              // On one click, make background less opaque
              if (CRNtoClicked[appointment.description] !== 1){
                // apply to all sections that have the same crn: compare all the idToCRN[id] and check if this is their CRN
                for (var i = 0; i < appointments.length; i++){
                  if (crn === appointments[i].description){ //crn matches
                    console.log("first click");
                    $('#scheduler').jqxScheduler('beginAppointmentsUpdate');
                    $("#scheduler").jqxScheduler('setAppointmentProperty', appointments[i].id, 'background', 'gray');
                    $('#scheduler').jqxScheduler('endAppointmentsUpdate');
                    CRNtoClicked[appointments[i].description] = 1;
                  }
                  else {  //crn doesn't match
                    // $("#scheduler").jqxScheduler('setAppointmentProperty', appointments[i].id, 'background', 'red'); 
                  }
                }
              }
              // after the second click, make event disappear
              else {
                // apply to all sections that are linked
                for (var i = 0; i < appointments.length; i++){
                  //if (idToCRN[appointments[i].id] === CRN){
                  if (crn === appointments[i].description){
                    console.log("second click, should delete");
                    $('#scheduler').jqxScheduler('deleteAppointment', appointments[i].id);
                  }
                }
              }
            });

            $('#scheduler').on('appointmentAdd', function (event) { var args = event.args; var appointment = args.appointment; console.log(appointment); });
            $scope.addSection = function(sec){
              // ADD for loop: for days that this section repeats:
              var newappointment = {
                id: 'id' + sec.id.toString(), //id for calendar
                description: sec.crn.toString(),  // IS THE CRN!!!!!!!!!!!
                location: sec.class_location,
                subject: sec.name,  // e.g. "CS440"
                start: sec.class_times[1], //(year, month, day, hour, minute, second)
                end: sec.class_times[2],
                calendar: "Class 3",
                resizable: false,
                draggable: false,
                readOnly: true,
              };
              appointments.push(newappointment);
              $('#scheduler').jqxScheduler('addAppointment', newappointment);
              console.log('Added section to calendar (appointment id: ' + newappointment.id + ')');
            };

        },
        resources:
        {
            colorScheme: "scheme05",
            dataField: "calendar",
            source:  new $.jqx.dataAdapter(source)
        },
        appointmentDataFields:
        {
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
        views:
        [
          { type: "weekView", showWeekends: false, timeRuler: { scaleStartHour: 8, scaleEndHour: 21 } }
        ]
    });

     // Test adding section to calendar
      $scope.addSection($scope.section);
      $scope.addSection($scope.section2);

    // **** end calendar view

}]);




