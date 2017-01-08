/**
 * Created by Joe on 4/1/17.
 */
angular.module('cities').controller('ChatController', ['$http', '$scope', function ($http, $scope) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getModule(p, g, number){
        var a = bigInt(p).pow(number);
        return a.mod(g)
    }

}]);