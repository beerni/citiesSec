/**
 * Created by Joe on 4/1/17.
 */


angular.module('cities').controller('ProductsController', ['$http', '$scope','$location','$rootScope', function ($http, $scope,$location,$rootScope) {
    console.log('Products controller');

    $scope.noProducts = false;

    refresh = function () {
        $http.get('https://localhost:8080/api/ad/user/lobo4').success(function (res) {
            console.log(res);
            if(res.length==0){
                $scope.noProducts = true;
            }
            else $scope.products = res;
        }).error(function (res) {
            console.log("KAPASAOOOOOOO");
        })
    }

    refresh();

    $scope.delete = function (id) {

        $http.delete('https://localhost:8080/api/ad/'+id).success(function (res) {
            console.log(res);
            refresh();
        }).error(function (res) {
            console.log("KAPASAOOOOOOO");
        })
    }

    $scope.edit = function (id) {
        window.localStorage.setItem('id',id);
        $location.path('/edit')

    }
    


}]);