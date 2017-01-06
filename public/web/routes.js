angular.module('cities', ['ngRoute', 'ngCookies','ui.bootstrap','ngImgCrop','btford.socket-io'])
    .run(['$rootScope', 'socketio', function ($rootScope, socket){

    }])
    .factory('socketio', ['$rootScope', function($rootScope){
        var socketUrl = "https://localhost:3000";
        var socket = null;
        return {
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
            },
            connect: function () {
                socket = io.connect();
            }
        }
    }])
    .config(['$routeProvider', function ($routeProvider) {
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



    }])
    .run(['$rootScope', 'socketio', function ($rootScope, socket) {
        $rootScope.clientKeys = rsaInt.generateKeys(512);
    }])
    .factory('socketio', ['$rootScope', function($rootScope){
        var socketUrl = "https://localhost:3000";
        var socket = null;
        return {
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
            },
            connect: function () {
                socket = io.connect();
            }
        }
    }])

