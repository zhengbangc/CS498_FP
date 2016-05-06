var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Schedules', function($window, $http){
    var parseJWT = function(token){
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    }

    return {
        get: function(scheduleID){
            return $http.get('http://scheduler.intense.io/api/schedules/'+scheduleID);
        },
        add: function(schedulename, semester){
            var tokenObject = parseJWT($window.sessionStorage['jwtToken']);
            var promise = $http({
                method: 'POST',
                url: 'http://scheduler.intense.io/api/schedules',
                data: $.param({
                    name: schedulename, 
                    user: tokenObject.id, 
                    term: semester, 
                    token: $window.sessionStorage['jwtToken']
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(response){
                
                return response;
            }, function(response){
                return response;
            });
            return promise;
        },
        put: function(schedule){  //modify a schedule
            var tokenObject = parseJWT($window.sessionStorage['jwtToken']);
            var promise = $http({
                method: 'PUT',
                url: 'http://scheduler.intense.io/api/schedules/' + schedule.id.toString(),
                data: $.param({
                    name: schedule.name, 
                    id: tokenObject.id, 
                    term: schedule.semester, 
                    sections: schedule.sections, 
                    token: $window.sessionStorage['jwtToken']
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(response){
                
                return response;
            }, function(response){
                return response;
            });
            return promise;
        }
    }
});

mp4Services.factory('Users', function($http, $window) {

    var parseJWT = function(token){
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    }

    return {
        get: function() {
            var tokenObject = parseJWT($window.sessionStorage['jwtToken']);
            var promise = $http.get('http://scheduler.intense.io/api/user/' + tokenObject.id)
                                .then(function(response){
                                    return response;
                                }, function (response){
                                    return response;
                                });
            return promise;
        },
        post: function(username, useremail, userpass){
            var promise = $http({
                method: 'POST',
                url: 'http://scheduler.intense.io/api/user',
                data: $.param({name:username , email: useremail, pass: userpass}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then( function (response){
                return response;
            }, function (response){
                return response;
            });

            return promise;
        },
        isAuthed: function(){
            var token = $window.sessionStorage['jwtToken'];
            if(token){
                var tokenObject = parseJWT(token);
                return Math.round(new Date().getTime() / 1000) <= tokenObject.exp;
            } else
                return false;
        },
        updateUser: function(username, useremail, userpass){
            var tokenObject = parseJWT($window.sessionStorage['jwtToken']);
            var promise = $http({
                method: 'PUT',
                url: 'http://scheduler.intense.io/api/user/' + tokenObject.id,
                data: $.param({name: username, email: useremail, pass: userpass, token: $window.sessionStorage['jwtToken']}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(response){
                return response;
            }, function(response){
                return response;
            });
            return promise;
        }
    }
});

mp4Services.factory('Login', function($http, $window){
    return {
        post: function(useremail, pass){
            var promise = $http({
                method: 'POST',
                url: 'http://scheduler.intense.io/api/login',
                data: $.param({username: useremail, password: pass}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then( function (response){
                return response;
            }, function (response){
                return response;
            });

            return promise
        }
        
    };
});

mp4Services.factory('Classes', function($window, $http){
    var parseJWT = function(token){
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    }

    return {
        get: function(classID){
            return $http.get('http://scheduler.intense.io/api/class/'+classID);
        },
        getByTerm: function(term){
            var where = '?term=' + term.toString();
            return $http.get('http://scheduler.intense.io/api/class' + where);
        }
    }
});
