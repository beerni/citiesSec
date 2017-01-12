/**
 * Created by Joe on 4/1/17.
 */


angular.module('cities').controller('ProductsController', ['$http', '$scope','$location','$rootScope','$cookies', function ($http, $scope,$location,$rootScope,$cookies) {
    console.log('Products controller');

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

            }
            else{
                console.log("NO TOKEN");
                $rootScope.isLogged=false;
                $location.path('/login');
            }
        })
    }

    $scope.noProducts = false;
    var userLogged= JSON.parse($cookies.get('tokenData')).user;
    $scope.userLogged = userLogged.username;
    console.log(userLogged);
    refresh = function () {
        $http.get('https://localhost:8080/api/ad/user/'+userLogged.username).success(function (res) {
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