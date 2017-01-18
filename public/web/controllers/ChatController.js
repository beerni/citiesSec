/**
 * Created by Joe on 4/1/17.
 */

angular.module('cities').controller('ChatController', ['$http', '$scope','socketio','$cookies','$rootScope','$routeParams','$window', function ($http, $scope, socket,$cookies,$rootScope, $routeParams, $window) {
    $scope.txt = {};
    var t='';
    $scope.txt.msg = '';
    $scope.convers=false;
    $scope.userChat='';
    $scope.allChats=[];
    $scope.mensajes=[];
    $scope.chatMsg=[];
    $scope.otheruser='';
    var texto = [];
    $scope.seeChat=false;
    $scope.change = function(id){
        $window.location.href='https://localhost:8080/#/chat/'+id;
    }
    if($routeParams.id !=undefined){
        var esta=false;
        for(var s=0;s < $rootScope.keyChats.length;s++) {
            if ($rootScope.keyChats[s].id == $routeParams.id) {
                esta = true;
                t = s;
            }
        }
            $http.get('https://localhost:8080/api/chat/id/'+ $routeParams.id).success(function (res) {
                console.log(res);
                for(var i =0; i<res.username.length;i++){
                    if(res.username[i]!=$rootScope.userLog.username){
                        $scope.otheruser=res.username[i];
                        if(esta==false) {
                            console.log("Pa que entras");
                            socket.emit('diffieInit', {
                                id: $routeParams.id,
                                user: res.username[i],
                                useri: $rootScope.userLog.username,
                                name: res.title,
                                idProduct: res.idProduct
                            });
                        }
                    }
                }
            }).error(function (res) {
                console.log("ERROR: ", res);
            })
        $scope.seeChat=true;

        for(var i; i < $rootScope.chatMens.length; i++){
            if($routeParams.id == $rootScope.chatMens[i].id){
                $scope.chatMsg.push($rootScope.chatMens[i]);
            }
        }
    }
    socket.on('messageChat', function(data){
        console.log("Entramos");
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
        console.log(a);
        console.log($scope.chatMsg);
        if(data.id==$routeParams.id){
            $scope.chatMsg.push(a);
        }
    });
    $scope.send = function () {
        if($rootScope.keys.secret!=undefined) {
            texto = operations.correct($scope.txt.msg);
            var txtenv = []
            for (var i = 0; i < texto.length; i++) {
                var msgEnc = bigInt(operations.convertToHex(texto[i]), 16);
                msgEnc = msgEnc * $rootScope.keys.secret;
                txtenv.push(msgEnc.toString(16))
            }
            socket.emit('messageChat', {msg: txtenv, user: $rootScope.userLog.username, id: $routeParams.id, useri: $scope.otheruser});
            $scope.txt.msg = '';
        }else{

        }
    };
    $http.get('https://localhost:8080/api/chat/'+$rootScope.userLog.username).success(function (res) {
        if(res.length!=0){
            $scope.convers=true;
        }
        $scope.allChats=res;
    }).error(function (res) {
        console.log("KAPASAOOOOOOO");
    });
    $http.get('https://localhost:8080/api/chat/msg/'+$rootScope.userLog.username).success(function (res) {
        console.log(JSON.parse($cookies.get('secretss')));
        var n = JSON.parse($cookies.get('secretss')).n;
        var d = JSON.parse($cookies.get('secretss')).d;
        for(var i = 0; i<res.length;i++){
            if(res[i].crypted==true){
                var a = bigInt(res[i].message, 16);
                res[i].message=operations.hex2a(a.modPow(new bigInt(d),new bigInt(n)).toString(16))
            }
            var txt = {};
            txt.user = res[i].username;
            txt.id=res[i].chatid;
            txt.msg=res[i].message
            $scope.chatMsg.push(txt);
        }
        console.log( $scope.mensajes);
    }).error(function (res) {
        console.log("KAPASAOOOOOOO");
    })

}]);

