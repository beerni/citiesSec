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
    $scope.chat = function(id, username, name, idchat){
        $http.get('https://localhost:8080/api/chat/idProduct/'+id+'/'+$rootScope.userLog.username+'/'+username).success(function(res){
            $window.location.href='https://localhost:8080/#/chat/'+res._id;
        }).error(function(){
            console.log('Error');
        })
        //socket.emit('diffieInit', {id:id, user: username, useri: $rootScope.userLog.username, name: name});
    }

    if(angular.isUndefined($cookies.get('secretss'))||JSON.parse($cookies.get('secretss')).bits==undefined||JSON.parse($cookies.get('secretss')).username!=$rootScope.userLog.username){
        console.log("PEro si entra");
        console.log(JSON.parse($cookies.get('secretss')));
        console.log(angular.isUndefined($cookies.get('secretss')));
        console.log(JSON.parse($cookies.get('secretss')).bits);
        console.log(JSON.parse($cookies.get('secretss')).username)
        $http.post('https://localhost:8080/api/user/update',{
            user: $rootScope.userLog.username,
            bits: $rootScope.clientKeys.publicKey.bits,
            n: $rootScope.clientKeys.publicKey.n,
            e: $rootScope.clientKeys.publicKey.e
        }).success(function (res) {
            $cookies.put('secretss', JSON.stringify({
                bits: $rootScope.clientKeys.publicKey.bits,
                n: $rootScope.clientKeys.publicKey.n,
                e: $rootScope.clientKeys.publicKey.e,
                username: $rootScope.userLog.username,
                privateKey: $rootScope.clientKeys.privateKey
            }));
        }).error(function (res) {
            console.log("KAPASAOOOOOOO");
        })
    }
}]);