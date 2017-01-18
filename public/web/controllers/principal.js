/**
 * Created by bernatmir on 10/12/16.
 */
angular.module('cities').controller('PrincipalController', ['$http', '$scope','$rootScope','$window','$cookies','$location', function ($http, $scope,$rootScope,$window,$cookies,$location) {

    if(angular.isUndefined($cookies.getObject('tokenData'))){
        $rootScope.isLogged=false;
        $location.path('/');
    }
    else{
        var header = {
            headers: {
                'x-access-token': JSON.parse($cookies.get('tokenData')).token
            }
        };
        $http.post('https://localhost:8080/api/validate',null,header).success(function(res){
            if(res=='OK'){
                console.log("OK");
                $rootScope.isLogged=true;
                //$location.path('/shop');
            }
            else{
                console.log("NO TOKEN");
                $rootScope.isLogged=false;
                $location.path('/login');
            }
        })
    }


    $scope.logout = function () {
        console.log('Logouts');
        $rootScope.isLogged = false;
        $rootScope.token = null;
        $cookies.remove('tokenData');
        $cookies.remove('user');
        $window.location.href = "https://localhost:8080/";
        socket.emit('disconnect', {user: $rootScope.userLog.user});
        socket.disconnect();
    }
}]);