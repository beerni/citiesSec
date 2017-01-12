/**
 * Created by Joe on 4/1/17.
 */
angular.module('cities').controller('ChatController', ['$http', '$scope','socketio','$cookies','$rootScope','$routeParams','$window', function ($http, $scope, socket,$cookies,$rootScope, $routeParams, $window) {
    $scope.txt = {};
    $scope.txt.msg = '';
    $scope.convers=false;
    $scope.userChat='';
    $scope.allChats=[];
    $scope.chatMsg=[];
    $scope.seeChat=false;
    $scope.change = function(id){
        $window.location.href='https://localhost:8080/#/chat/'+id;
    }
    if($routeParams.id !=undefined){
        $scope.seeChat=true;
        for(var i; i < $rootScope.chatMens.length; i++){
            if($routeParams.id == $rootScope.chatMens[i].id){
                $scope.chatMsg.push($rootScope.chatMens[i]);
            }
        }
    }
    socket.on('messageChat', function(data){
        console.log(data.msg);
        var msgDes = bigInt(data.msg, 16)/$rootScope.keys.secret;
        var a = {};
        a.msg = operations.hex2a(msgDes.toString(16));
        a.user = data.user;
        a.id = data.id;
        if(data.id==$routeParams.id){
            $scope.chatMsg.push(a);
        }
    });
    $scope.send = function () {
        console.log($scope.txt.msg);
        var msgEnc = bigInt(operations.convertToHex($scope.txt.msg),16);
        msgEnc = msgEnc*$rootScope.keys.secret;
        socket.emit('messageChat', {msg: msgEnc.toString(16), user: $rootScope.userLog.username, id: $routeParams.id});
        $scope.txt.msg='';
    };
    $http.get('https://localhost:8080/api/chat/'+$rootScope.userLog.username).success(function (res) {
        if(res.length!=0){
            $scope.convers=true;
        }
        $scope.allChats=res;
    }).error(function (res) {
        console.log("KAPASAOOOOOOO");
    })

}]);