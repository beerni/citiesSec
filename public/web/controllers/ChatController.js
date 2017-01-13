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
    var texto = [];
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
        var txt = '';
        for(var i = 0; i<data.msg.length;i++){
            var msgDes = bigInt(data.msg[i], 16)/$rootScope.keys.secret;
            txt = txt+operations.hex2a(msgDes.toString(16));
        }
        console.log(txt);
        var a = {};
        a.msg = txt;
        a.user = data.user;
        a.id = data.id;
        if(data.id==$routeParams.id){
            $scope.chatMsg.push(a);
        }
    });
    $scope.send = function () {
        texto = operations.correct($scope.txt.msg);
        var txtenv=[]
        for(var i = 0; i < texto.length; i++){
            var msgEnc = bigInt(operations.convertToHex(texto[i]),16);
            msgEnc = msgEnc*$rootScope.keys.secret;
            txtenv.push(msgEnc.toString(16))
        }
        socket.emit('messageChat', {msg: txtenv, user: $rootScope.userLog.username, id: $routeParams.id});
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