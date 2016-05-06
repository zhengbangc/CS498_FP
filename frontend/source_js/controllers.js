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




mp4Controllers.controller('EditScheduleController', ['$scope', '$http', 'Schedules', '$window' , function($scope, $http, Schedules, $window) {

  $(document).foundation();

  // Need to get all classes for the selected semester
  //Classes.getByTerm("Spring 2016").success(function(data){
  //  //$scope.classes = data.data;
  //});
  $scope.classes = {
    'name': 'CS 101 - Hello World'
  };

  $scope.saveSchedule = function(){
    console.log("schedule saving");
    //for each thing in assignment, save
    $scope.schedule.sections = [];
    for (var i=0; i<appointments.length; i++){
      $scope.schedule.sections.push(appointments[i]._id);
    }
    Schedules.put($scope.schedule);
  }


  $scope.section = { 
    'id': 8, 
    'crn': 88888,
    'name':'CS 440 Artificial Intelligence', 
    'term': 'Fall 2016',
    'section_code': 'ADJ',
    'instructor': 'Ur Mom',
    'credit_hours': 3,
    'hours': 3, 
    'section_type': 3,
    'class_times': [new Date(2016, 10, 23, 13, 0, 0), new Date(2016, 10, 23, 13, 50, 0)], 
    'class_location':'123 Sesame St',
    'restrictions': 'Pre-req: CS 225'
  };
    $scope.section2 = { 
    'id': 9, 
    'crn': 99999,
    'name':'CS 357', 
    'term': 'Fall 2016',
    'section_code': 'ADJ',
    'instructor': 'Ur Mom',
    'credit_hours': 3,
    'hours': 3, 
    'section_type': 3,
    'class_times': [new Date(2016, 10, 21, 13, 0, 0), new Date(2016, 10, 21, 13, 50, 0)], 
    'class_location':'Elm St',
    'restrictions': 'Pre-req: CS 225'
  };
  $scope.schedule = { 'name': 'My First Schedule' };


  $scope.toggleCalendar = function(){
    console.log('gonna expand calendar now');
    $('.calendar').toggleClass('large-8 large-12'); //change large-8 to large-12 or vice versa
    //find calendar div
    //expand it to span all 12 columns
  };



  // ********** CALENDAR STUFF ***************

    var appointments = new Array();

    var appointment1 = {
        _id: 1,
        id: "id1",
        CRN: 11111,
        description: "System programming",
        location: "1404 Siebel",
        subject: "CS 241",
        calendar: "Class 1",
        start: new Date(2016, 10, 23, 9, 0, 0), //(year, month, day, hour, minute, second)
        end: new Date(2016, 10, 23, 9, 50, 0),
        resizable: false,
        draggable: false,
        readOnly: true
    }

    var appointment2 = {
        _id: 2,
        id: "id2",
        CRN: 11111,
        description: "Computer Architecture",
        location: "1404 Siebel",
        subject: "CS 233",
        calendar: "Class 2",
        start: new Date(2016, 10, 24, 10, 0, 0),
        end: new Date(2016, 10, 24, 10, 50, 0),
        resizable: false,
        draggable: false,
        readOnly: true
    }

    var appointment3 = {
        _id: 3,
        id: "id3",
        CRN: 33333,
        description: "Numerical Methods",
        location: "1404 Siebel",
        subject: "CS 357",
        calendar: "Class 3",
        start: new Date(2016, 10, 27, 11, 0, 0),
        end: new Date(2016, 10, 27, 13, 0, 0),
        resizable: false,
        draggable: false,
        readOnly: true
    }

    var appointment4 = {
        _id: 4,
        CRN: 44444,
        id: 'id4',
        description: "The Art and Science of Web Programming",
        location: "1404 Siebel",
        subject: "CS 498RK1",
        calendar: "Class 4",
        start: new Date(2016, 10, 23, 16, 0, 0),
        end: new Date(2016, 10, 23, 18, 0, 0),
        resizable: false,
        draggable: false,
        readOnly: true
    }

    appointments.push(appointment1);
    appointments.push(appointment2);
    appointments.push(appointment3);
    appointments.push(appointment4);

    var source =
    {
        dataType: "array",
        dataFields: [
            { name: '_id', type: 'int' },
            { name: 'id', type: 'string' },
            { name: 'CRN', type: 'int' },
            { name: 'description', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'subject', type: 'string' },
            { name: 'calendar', type: 'string' },
            { name: 'start', type: 'date' },
            { name: 'end', type: 'date' },
            { name: 'recurrenceRule', type: 'string' },
            { name: 'draggable', type: 'boolean' },
            { name: 'resizable', type: 'boolean' },
            { name: 'readOnly', type: 'boolean' }
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
        /*renderAppointment: function(data){
          //var img = "<img style='top: 2px; position: relative;' src='../../images/person.png'/>";
          console.log('data.appointment.id = ' + data.appointment.id)
          data.html = data.appointment.subject + '\n' + data.appointment.description + '<button class="close-button" type="button" ng-model="apptID" ng-value="'+ data.appointment.id +'" ng-click="removeAppointment()"><span aria-hidden="true">&times;</span></button>';
          return data;
        },*/
        // *** DIALOG / MODAL WINDOW:
        /*editDialogCreate: function (dialog, fields, editAppointment) {
          // hide repeat option
          fields.repeatContainer.hide();
          // hide status option
          fields.statusContainer.hide();
          // hide timeZone option
          fields.timeZoneContainer.hide();
          // hide color option
          fields.colorContainer.hide();
          // hide from option
          fields.fromContainer.hide();
          // hdie to option
          fields.toContainer.hide();
          // hide resource
          fields.resourceContainer.hide();
          fields.subjectLabel.html("Class");
          fields.locationLabel.html("Where");
      
         },  // end modal/dialog window   */
        ready: function () {

            $scope.apptID = "id1";
            $('[data-key="jqxscheduler_0"]').html("nothing");

            // On clicking twice, delete a class
            $('#scheduler').on('appointmentClick', function (event) { 
              var args = event.args; 
              var appointment = args.appointment;
              console.log("appointment CRN = " + appointment.CRN);
              // on one click, make background less opaque
              if (!appointment.clicked){
                // apply to all sections that are linked
                for (var i = 0; i < appointments.length; i++){
                  if (appointments[i].CRN === appointment.CRN){
                    console.log("first click");
                    appointments[i].clicked = 1;
                  }
                }
              }
              // after the second click, make event disappear
              else {
                // apply to all sections that are linked
                var clickedCRN = appointment.CRN;

                for (var i=0; i < appointments.length; i++){
                  if (appointments[i].CRN === clickedCRN){
                    console.log("second click, should delete");
                    appointments[i].clicked = 1;
                    $('#scheduler').jqxScheduler('deleteAppointment', appointments[i].id);
                  }
                }
              }
            });

            $scope.removeAppointment = function(){
              console.log('removeAppointment()');
              console.log('removing ' + $scope.apptID);
              $('#scheduler').jqxScheduler('deleteAppointment', $scope.apptID);
            }

            $scope.addSection = function(sec){
              // ADD for loop: for days that this section repeats:
              var newappointment = {
                _id: sec.id,
                id: 'id' + sec.id.toString(),
                CRN: sec.crn,
                description: sec.name,  // name of the class ("Artificial Intelligence")
                location: sec.class_location,
                subject: sec.name,  // e.g. "CS440"
                start: sec.class_times[0], //(year, month, day, hour, minute, second)
                end: sec.class_times[1],
                resizable: false,
                draggable: false,
                readOnly: true
              }
              appointments.push(newappointment);
              // Add appointment and ensure it is not draggable or resizables
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
            recurrencePattern: "recurrenceRule",
            resizable: "resizable",
            draggable: "draggable",
            readOnly: "readOnly"
        },
        views:
        [
          { type: "weekView", showWeekends: false, timeRuler: { scaleStartHour: 8, scaleEndHour: 21 } }
        ]
    });


    // Add a section to calendar

    $scope.addSection($scope.section);
    $scope.addSection($scope.section2);

    // **** end calendar view

}]);




