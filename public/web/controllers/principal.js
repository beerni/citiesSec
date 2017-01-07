/**
 * Created by bernatmir on 10/12/16.
 */
angular.module('cities').controller('PrincipalController', ['$http', '$scope','$rootScope','$window','$cookies', function ($http, $scope,$rootScope,$window,$cookies) {
    $scope.logout = function () {
        console.log('Logouts');
        $rootScope.isLogged = false;
        $rootScope.token = null;
        $cookies.remove('tokenData');
        $window.location.href = "https://localhost:8080/";
    }
}]);