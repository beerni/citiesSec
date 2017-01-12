/**
 * Created by aitor on 7/1/17.
 */

angular.module('cities').controller('DetailsController', ['$http', '$scope','$routeParams','$cookies','$rootScope','$location', function ($http, $scope, $routeParams,$cookies,$rootScope,$location) {
    $scope.product ={};

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

    init = function () {
        $http.get('https://localhost:8080/api/ad/'+ $routeParams.id).success(function (res) {
            console.log(res);
            $scope.product = res;

        }).error(function (res) {
            console.log("ERROR: ", res);
        })
    };

    init();
}]);