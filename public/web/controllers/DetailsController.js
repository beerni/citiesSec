/**
 * Created by aitor on 7/1/17.
 */

angular.module('cities').controller('DetailsController', ['$http', '$scope','$routeParams','$cookies','socketio','$rootScope','$window', function ($http, $scope, $routeParams, $cookies, socket, $rootScope, $window) {
    $scope.product ={};
    console.log('DETAIL OF A PRODUCT');
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
        if($rootScope.paillierKeys ==undefined){
            $http.get('https://localhost:8080/api/paillierKeys').success(function (response) {
                $rootScope.paillierKeys = response
            });
        }
        var msg = '1';
        var n = bigInt($rootScope.paillierKeys.n);
        var n2 = n.pow(2);
        var g = bigInt($rootScope.paillierKeys.g);
        var r1 = bigInt.randBetween(bigInt(0), n);
        var bi1 =  bigInt(msg).mod(n);
        var visit = g.modPow(bi1, n2).multiply(r1.modPow(n, n2)).mod(n2).toString(16);
        $http.post('https://localhost:8080/api/ad/'+ $routeParams.id,{data:visit}).success(function (res) {
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