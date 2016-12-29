angular.module('cities', ['ngRoute','ngCookies'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/pages/principal.html',
                controller:'PrincipalController'
            })
            .when('/shop', {
                templateUrl: 'templates/pages/anuncios.html',
                controller:'ShopController'
            })
            .when('/login', {
                templateUrl: 'templates/pages/loginRegistration.html',
                controller:'LoginController'
            })
            .when('/anonimous/login', {
                templateUrl: 'templates/pages/anonimousLogin.html',
                controller:'AnonimousController'
            })

    }]);
