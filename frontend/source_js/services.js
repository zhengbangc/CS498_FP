var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Schedules', function(){
    var baseUrl = '/api/schedules'; //REPLACE W/ DATABASE URL
    return {
        get: function(userID){
            return $http.get(baseUrl);
        },
        getByUser: function(userID){
            var where = '?where={ \"user\": \"' + userID.toString() + '\"}';    //or whatever
            return $http.get(baseUrl + where);
        },
        add: function(newSchedule){
            return $http.post(baseUrl, newSchedule);
        }
    }
});

mp4Services.factory('Users', function($http, $window) {
    var baseUrl = '/api/users'; //REPLACE W/ DATABASE URL
    return {
        get: function() {
            return $http.get(baseUrl);
        }
    }
});
