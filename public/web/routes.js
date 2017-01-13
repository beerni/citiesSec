angular.module('cities', ['ngRoute', 'ngCookies','ui.bootstrap','ngImgCrop','btford.socket-io'])
    .run(['$rootScope', 'socketio','$cookies','$window', function ($rootScope, socket, $cookies,$window) {
        $rootScope.clientKeys = rsaInt.generateKeys(512);
        if (angular.isUndefined($cookies.get('user'))){
            $rootScope.isLogged=false;
        }
        else{
            $window.location.href = 'https://localhost:8080/#/shop';
            $rootScope.userLog = JSON.parse($cookies.get('user'));
            $rootScope.isLogged = true;
            $rootScope.chatMens = [];
            $rootScope.keyChats = [];
            $rootScope.keys = {};
            $rootScope.keys.module = '';
            $rootScope.keys.random = '';
            $rootScope.keys.id = '';
            $rootScope.keys.username = '';
            $rootScope.keys.secret = '';
            $rootScope.idChat=[];

            if($window.location.href!="https://localhost:8080"){
                socket.connect();
                $cookies.remove('user');
            }
            socket.on('connection', function (data) {
                socket.emit('username', $rootScope.userLog.username);
            });
            socket.on('diffieInit', function(data){
                $rootScope.keys.random = bigInt.randBetween(1, 10);
                $rootScope.keys.module = operations.getModule(data.prime, data.mod, $rootScope.keys.random);
                console.log($rootScope.keys.module);
                $rootScope.keys.username = data.user;
                $rootScope.keys.id = data.id;
                socket.emit('diffie', {module: $rootScope.keys.module, id: data.id, user: data.user, mod: data.mod, prime:data.prime});
            });
            socket.on('diffie', function(data){
                $rootScope.keys.secret = operations.getModule(data.prime, data.mod, data.module);
                for(var i = 0; i < $rootScope.keyChats.length; i++){
                    if($rootScope.keyChats[i].id == data.id){
                        $rootScope.keyChats.splice(i, 1);
                    }
                }
                $rootScope.keyChats.push($rootScope.keys);
                console.log($rootScope.keys.secret);
            });
            socket.on('messageChat', function(data){
                console.log(data.msg);
                var txt = '';
                for(var i = 0; i<data.msg.length;i++){
                    var msgDes = bigInt(data.msg[i], 16)/$rootScope.keys.secret;
                    txt = txt+operations.hex2a(msgDes.toString(16));
                }
                var a = {};
                a.msg = txt;
                a.user = data.user;
                a.id = data.id;
                $rootScope.chatMens.push(a);
                var esta = false;
                for(var i = 0;i < $rootScope.chatMens.length; i++ ){
                    for (var j = 0; j<$rootScope.idChat.length;j++){
                        if ($rootScope.idChat[j].id==$rootScope.chatMens[i].id){
                            if($rootScope.idChat[j].user==$rootScope.chatMens[i].user)
                                esta=true;
                            else if($rootScope.chatMens[i].user==$rootScope.userLog) {
                                esta = true;
                            }
                        }
                    }
                    if(esta==false){
                        $rootScope.idChat.push($rootScope.chatMens[i]);
                    }
                    esta = false;
                }
                console.log($rootScope.idChat);
                console.log($rootScope.chatMens);
            });


        }
    }])
    .factory('socketio', ['$rootScope', function($rootScope){
        var socketUrl = "https://localhost:3040";
        var socket = null;
        return {
            connect: function () {
                socket = io.connect(socketUrl, {reconnect: true});
            },
            on: function(eventName, callback){
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function(){
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args= arguments;
                    $rootScope.$apply(function () {
                        if(callback){
                            callback.apply(socket,args);
                        }
                    });
                });
            },
            disconnect: function () {
                socket.disconnect();
            }
        }
    }])
    .config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/pages/principal.html',
                controller: 'PrincipalController'
            })
            .when('/shop', {
                templateUrl: 'templates/pages/anuncios.html',
                controller: 'ShopController'
            })
            .when('/login', {
                templateUrl: 'templates/pages/loginRegistration.html',
                controller: 'LoginController'
            })
            .when('/anonimous/login', {
                templateUrl: 'templates/pages/anonimousLogin.html',
                controller: 'AnonimousController'
            })
            .when('/loginTest', {
                templateUrl: 'templates/pages/testLogin.html',
                controller: 'AnonimousController'
            })
            .when('/create', {
                templateUrl: 'templates/pages/createAd.html',
                controller: 'CreateadController'
            })
            .when('/edit', {
                templateUrl: 'templates/pages/EditProduct.html',
                controller: 'EditProduct'
            })
            .when('/products', {
                templateUrl: 'templates/pages/products.html',
                controller: 'ProductsController'
            })
            .when('/chat', {
                templateUrl: 'templates/pages/chat.html',
                controller: 'ChatController'
            })
            .when('/chat/:id', {
                templateUrl: 'templates/pages/chat.html',
                controller: 'ChatController'
            })
            .when('/details/:id', {
                templateUrl: 'templates/pages/details.html',
                controller: 'DetailsController'
            })
    }])

