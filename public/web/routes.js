angular.module('cities', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngImgCrop', 'btford.socket-io'])
    .run(['$rootScope', 'socketio', '$cookies', '$window', '$http','$location', function ($rootScope, socket, $cookies, $window, $http,$location) {
        $rootScope.clientKeys = rsaInt.generateKeys(512);
        if (angular.isUndefined($cookies.getObject('tokenData'))) {
            console.log("NO HAY TOKEN")
            $rootScope.isLogged = false;
            $location.path('/');
        }
        else {
            var header = {
                headers: {
                    'x-access-token': JSON.parse($cookies.get('tokenData')).token
                }
            };
            $http.post('https://localhost:8080/api/validate', null, header).success(function (res) {
                if (res == 'OK') {
                    console.log("OK");
                    $rootScope.isLogged = true;
                    $rootScope.chatMens = [];
                    $rootScope.keyChats = [];
                    $rootScope.keys = {};
                    $rootScope.keys.module = '';
                    $rootScope.keys.random = '';
                    $rootScope.keys.id = '';
                    $rootScope.keys.username = '';
                    $rootScope.keys.secret = '';
                    $rootScope.idChat = [];
                    $rootScope.userPublic = [];
                    var userLogged = JSON.parse($cookies.get('tokenData'));
                    if ($window.location.href != "https://localhost:8080") {
                        $cookies.remove('user');
                        socket.on('connection', function (data) {
                            socket.emit('username', userLogged.user.username);
                        });
                        socket.on('diffieInit', function (data) {
                            $rootScope.keys.random = bigInt.randBetween(1, 10);
                            $rootScope.keys.module = operations.getModule(data.prime, data.mod, $rootScope.keys.random);
                            console.log($rootScope.keys.module);
                            $rootScope.keys.username = data.user;
                            $rootScope.keys.id = data.id;
                            socket.emit('diffie', {
                                module: $rootScope.keys.module,
                                id: data.id,
                                user: data.user,
                                mod: data.mod,
                                prime: data.prime
                            });
                        });
                        socket.on('diffie', function (data) {
                            $rootScope.keys.secret = operations.getModule(data.prime, data.mod, data.module);
                            for (var i = 0; i < $rootScope.keyChats.length; i++) {
                                if ($rootScope.keyChats[i].id == data.id) {
                                    $rootScope.keyChats.splice(i, 1);
                                }
                            }
                            $rootScope.keyChats.push($rootScope.keys);
                            console.log($rootScope.keys.secret);
                        });
                        socket.on('notConnected', function (data) {
                            for (var i = 0; i < $rootScope.userPublic.length; i++) {
                                if ($rootScope.userPublic[i].user == data.user) {
                                    $rootScope.userPublic[i].e = data.e;
                                    $rootScope.userPublic[i].n = data.n;
                                    $rootScope.userPublic[i].user = data.user;
                                }
                            }
                        })
                        socket.on('publicKeyChat', function (data) {
                            var txt = '';
                            var cryptmsg = []
                            for (var i = 0; i < data.msg.length; i++) {
                                var msgDes = bigInt(data.msg[i], 16) / $rootScope.keys.secret;
                                txt = txt + operations.hex2a(msgDes.toString(16));

                            }
                            ;
                            console.log(txt);
                            var msg = bigInt(operations.convertToHex(txt), 16);
                            var cryptmsg = msg.modPow(new bigInt(data.public.e), new bigInt(data.public.n));
                            console.log(cryptmsg);
                            socket.emit('publicKeyChat', {
                                msg: cryptmsg.toString(16),
                                user: userLogged.user.username,
                                id: data.id,
                                useri: data.useri
                            })
                        });
                    }
                }
                else {
                    console.log("NO TOKEN");
                    $rootScope.isLogged = false;
                    $location.path('/login');
                }
            })
        }
    }])
    .factory('socketio', ['$rootScope', function ($rootScope) {
        var socketUrl = "https://localhost:3040";
        var socket = socket = io.connect(socketUrl, {reconnect: true});

        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            },
            disconnect: function () {
                socket.disconnect();
            },
            socket: socket
        }
    }])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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

