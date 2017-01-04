/**
 * Created by bernatmir on 10/12/16.
 */
angular.module('cities').controller('ShopController', ['$http', '$scope', function ($http, $scope) {
    console.log('Shop controller');


    $http.get('https://localhost:8080/api/ad/getAll').success(function (res) {
        console.log(res);
        $scope.products = res;
    }).error(function (res) {
        console.log("KAPASAOOOOOOO");
    })

}]);