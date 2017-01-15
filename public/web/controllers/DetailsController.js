/**
 * Created by aitor on 7/1/17.
 */

angular.module('cities').controller('DetailsController', ['$http', '$scope','$routeParams','$cookies','socketio','$rootScope','$window', function ($http, $scope, $routeParams, $cookies, socket, $rootScope, $window) {
    $scope.product ={};

    init = function () {
        $http.get('https://localhost:8080/api/ad/'+ $routeParams.id).success(function (res) {
            console.log(res);
            $scope.product = res;
            $cookies.put('chatInfo', JSON.stringify(res));

        }).error(function (res) {
            console.log("ERROR: ", res);
        })
    };
    $scope.chat = function(){
        $http.get('https://localhost:8080/api/chat/idProduct/'+$routeParams.id+'/'+$rootScope.userLog.username+'/'+$rootScope.product.username).success(function(res){
            $window.location.href='https://localhost:8080/#/chat/'+res._id;
        }).error(function(){
            console.log('Error');
        })
        //socket.emit('diffieInit', {id:$routeParams.id, user: $scope.product.username, useri: $rootScope.userLog.username, name: $scope.product.title});
    }

    init();
}]);