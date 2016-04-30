var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Schedules', function(){
    var baseUrl = '/api/schedules'; //REPLACE W/ DATABASE URL
    return {
        get: function(userID){
            return $http.get(baseUrl);
        },
        getByUser: function(userID, token){
            var where = '?where={ \"user\": \"' + userID.toString() + '\"}';    //or whatever
            return $http.get(baseUrl + where);
        },
        add: function(newSchedule){
            return $http.post(baseUrl, newSchedule);
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