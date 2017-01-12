angular.module('cities', ['ngRoute', 'ngCookies','ui.bootstrap','ngImgCrop','btford.socket-io'])
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
            .when('/details/:id', {
                templateUrl: 'templates/pages/details.html',
                controller: 'DetailsController'
            })


    }])
    .run(['$rootScope', 'socketio','$cookies','$http','$location', function ($rootScope, ocket,$cookies,$http,$location) {
        $rootScope.clientKeys = rsaInt.generateKeys(512);
        if(angular.isUndefined($cookies.getObject('tokenData'))){
            console.log("NO HAY TOKEN")
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

