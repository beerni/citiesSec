angular.module('cities', ['ngRoute', 'ngCookies','btford.socket-io'])
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

    }])
    .run(function ($rootScope) {
        $rootScope.clientKeys = rsaInt.generateKeys(512);
    });
