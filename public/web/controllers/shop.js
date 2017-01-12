/**
 * Created by bernatmir on 10/12/16.
 */
angular.module('cities').controller('ShopController', ['$http', '$scope','$cookies','$rootScope','socketio','$window', function ($http, $scope, $cookies,$rootScope,socket,$window) {
    console.log('Shop controller');


    $http.get('https://localhost:8080/api/ad/getAll').success(function (res) {
        console.log(res);
        $scope.products = res;
    }).error(function (res) {
        console.log("KAPASAOOOOOOO");
    })
    $scope.chat = function(id, username, name){
        socket.emit('diffieInit', {id:id, user: username, useri: $rootScope.userLog.username, name: name});
        $window.location.href='https://localhost:8080/#/chat/'+id;
    }

}]);