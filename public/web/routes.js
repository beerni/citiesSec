angular.module('cities', ['ngRoute', 'ngCookies','ui.bootstrap','ngImgCrop','btford.socket-io'])
    .run(['$rootScope', 'socketio','$cookies', function ($rootScope, socket, $cookies) {
        $rootScope.clientKeys = rsaInt.generateKeys(512);
        if (angular.isUndefined($cookies.get('user'))){
            $rootScope.isLogged=false;
        }
        else{
            $rootScope.userLog = JSON.parse($cookies.get('user'));
            $rootScope.isLogged = true;
            socket.connect();
            socket.on('connection', function (data) {
                console.log(data);
            });
            socket.on('connection', function (data) {
                socket.emit('username', $rootScope.userLog.username);
            })
        }
    }])
    .factory('socketio', ['$rootScope', function($rootScope){
        var socketUrl = "http://localhost:3040";
        var socket = null;
        return {
            connect: function () {
                socket = io.connect(socketUrl, {reconnect: true});
                console.log(socket);

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
            .when('/details/:id', {
                templateUrl: 'templates/pages/details.html',
                controller: 'DetailsController'
            })
    }])

