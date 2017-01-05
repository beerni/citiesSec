angular.module('cities', ['ngRoute', 'ngCookies','ui.bootstrap','ngImgCrop'])
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
    .run(function ($rootScope) {
        $rootScope.clientKeys = rsaInt.generateKeys(512);

});
