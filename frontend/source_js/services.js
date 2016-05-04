var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Schedules', function($window, $http){
    var parseJWT = function(token){
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    }

    return {
        get: function(userID){
            return $http.get(baseUrl);
        },
        getByUser: function(userID, token){
            var where = '?where={ \"user\": \"' + userID.toString() + '\"}';    //or whatever
            return $http.get(baseUrl + where);
        },
        add: function(schedulename, semester){
            var tokenObject = parseJWT($window.localStorage['jwtToken']);
            // console.log(tokenObject.id);
            var promise = $http({
                method: 'POST',
                url: 'http://scheduler.intense.io/api/schedules',
                data: $.param({name: schedulename, userId: tokenObject.id, token: $window.localStorage['jwtToken']}),
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
            var tokenObject = parseJWT($window.localStorage['jwtToken']);
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
            var token = $window.localStorage['jwtToken'];
            if(token){
                var tokenObject = parseJWT(token);
                return Math.round(new Date().getTime() / 1000) <= tokenObject.exp;
            } else
                return false;
        },
        updateUser: function(username, useremail, scheduleArray,userpass){
            var tokenObject = parseJWT($window.localStorage['jwtToken']);
            var promise = $http({
                method: 'PUT',
                url: 'http://scheduler.intense.io/api/user/' + tokenObject.id,
                data: $.param({name: username, email: useremail, schedules: scheduleArray, pass: userpass, token: $window.localStorage['jwtToken']}),
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