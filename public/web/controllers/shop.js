/**
 * Created by bernatmir on 10/12/16.
 */
<<<<<<< HEAD
angular.module('cities').controller('ShopController', ['$http', '$scope','$cookies','$location','$rootScope', function ($http, $scope,$cookies,$location,$rootScope) {
=======
angular.module('cities').controller('ShopController', ['$http', '$scope','$cookies','$rootScope','socketio','$window', function ($http, $scope, $cookies,$rootScope,socket,$window) {
>>>>>>> socket
    console.log('Shop controller');

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
        $http.post('https://localhost:8080/api/user/update',{
            user: $rootScope.userLog.username,
            bits: $rootScope.clientKeys.publicKey.bits,
            n: $rootScope.clientKeys.publicKey.n.toString(),
            e: $rootScope.clientKeys.publicKey.e.toString()
        }).success(function (res) {
            $cookies.put('secretss', JSON.stringify({
                bits: $rootScope.clientKeys.publicKey.bits,
                n: $rootScope.clientKeys.publicKey.n.toString(),
                e: $rootScope.clientKeys.publicKey.e.toString(),
                username: $rootScope.userLog.username,
                d: $rootScope.clientKeys.privateKey.d.toString()
            }));

        }).error(function (res) {
            console.log("KAPASAOOOOOOO");
        })
    }
}]);