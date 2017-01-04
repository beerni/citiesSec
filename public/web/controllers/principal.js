/**
 * Created by bernatmir on 10/12/16.
 */
angular.module('cities').controller('PrincipalController', ['$http', '$scope','$rootScope', function ($http, $scope,$rootScope) {

    console.log("index");


    $scope.logout = function () {
        console.log("logout");
    }


}]);