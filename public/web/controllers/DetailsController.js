/**
 * Created by aitor on 7/1/17.
 */

angular.module('cities').controller('DetailsController', ['$http', '$scope','$routeParams', function ($http, $scope, $routeParams) {
    $scope.product ={};

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