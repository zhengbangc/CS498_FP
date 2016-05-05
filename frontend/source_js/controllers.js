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

/*  Classes.getBySemester().success(function(data){
    $scope.classes = data.data;
  });
*/
  // Need to get all classes for the selected semester

  $(document).foundation();

  $scope.section = { 
    'id': 8, 
    'crn': 22222,
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
    'crn': 22222,
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
        id: "id1",
        description: "System programming",
        location: "1404 Siebel",
        subject: "CS 241",
        calendar: "Class 1",
        start: new Date(2016, 10, 23, 9, 0, 0), //(year, month, day, hour, minute, second)
        end: new Date(2016, 10, 23, 9, 50, 0),
        resizable: false,
        draggable: false
    }

    var appointment2 = {
        id: "id2",
        description: "",
        location: "",
        subject: "CS 233",
        calendar: "Class 2",
        start: new Date(2016, 10, 24, 10, 0, 0),
        end: new Date(2016, 10, 24, 10, 50, 0),
        resizable: false,
        draggable: false
    }

    var appointment3 = {
        id: "id3",
        description: "",
        location: "",
        subject: "CS 357",
        calendar: "Class 3",
        start: new Date(2016, 10, 27, 11, 0, 0),
        end: new Date(2016, 10, 27, 13, 0, 0),
        resizable: false,
        draggable: false
    }

    var appointment4 = {
        id: 'id4',
        description: "",
        location: "",
        subject: "CS 498RK1",
        calendar: "Class 4",
        start: new Date(2016, 10, 23, 16, 0, 0),
        end: new Date(2016, 10, 23, 18, 0, 0),
        resizable: false,
        draggable: false
    }

    var appointment5 = {
        id: 'id5',
        description: "",
        location: "",
        subject: "Hort 100",
        calendar: "Class 5",
        start: new Date(2016, 10, 25, 15, 0, 0),
        end: new Date(2016, 10, 25, 17, 0, 0),
        resizable: false,
        draggable: false
    }

    var appointment6 = {
        id: 'id6',
        description: "",
        location: "",
        subject: "Interview with Nancy",
        calendar: "Class 6",
        start: new Date(2016, 10, 26, 14, 0, 0),
        end: new Date(2016, 10, 26, 16, 0, 0),
        resizable: false,
        draggable: false
    }
    appointments.push(appointment1);
    appointments.push(appointment2);
    appointments.push(appointment3);
    appointments.push(appointment4);
    appointments.push(appointment5);
    appointments.push(appointment6);

    // prepare the data -- change this to fit our data!!!!!!!!!!!!!
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
            { name: 'resizable', type: 'boolean' }
        ],
        id: 'id',
        localData: appointments
        //url: '../sampledata/appointments.txt' //use this to get data from a file! (e.g. a .json file)
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
        // *** DIALOG / MODAL WINDOW:
        editDialogCreate: function (dialog, fields, editAppointment) {
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
      
         },  // end modal/dialog window   
        ready: function () {

            $('#scheduler').on('appointmentClick', function (event) { 
              var args = event.args; 
              var appointment = args.appointment; 
              // make the dialog open in the middle
              var vw = $( window ).width();
              var vh = $( window ).height();
              var left = vw/2;
              var top = vh/2;
              $('#scheduler').jqxScheduler('openDialog', left, top);  //left,top
            });

            $scope.addSection = function(sec){
              // ADD for loop: for days that this section repeats:
              var newappointment = {
                id: 'id' + sec.id.toString(),
                description: sec.name,  // name of the class ("Artificial Intelligence")
                location: sec.class_location,
                subject: sec.name,  // e.g. "CS440"
                start: sec.class_times[0], //(year, month, day, hour, minute, second)
                end: sec.class_times[1],
                resizable: false,
                draggable: false
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




