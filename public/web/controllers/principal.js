/**
 * Created by bernatmir on 10/12/16.
 */
angular.module('cities').controller('PrincipalController', ['$http', '$scope','$rootScope','$window','$cookies','socketio', function ($http, $scope,$rootScope,$window,$cookies,socket) {
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