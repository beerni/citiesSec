/**
 * Created by Joe on 5/1/17.
 */

angular.module('cities').controller('CreateadController', ['$http', '$scope','$location','$cookies','$rootScope', function ($http, $scope,$location,$cookies,$rootScope) {

    if(angular.isUndefined($cookies.getObject('tokenData'))){
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
    var userLogged = JSON.parse($cookies.get('tokenData'));
    console.log(userLogged);
    $scope.myCroppedImage='';
    $scope.product = {};
    console.log(userLogged.user);
    $scope.product.username = userLogged.user.username;

    //PARA QUE SE MUESTRE LA IMAGEN EN MODO PREVIEW
    var handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myCroppedImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    //
    // RANGO DE PRECIO
    $scope.range_price = function(start,end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };
    //

    $scope.create = function () {
        if($rootScope.paillierKeys ==undefined){
            $http.get('https://localhost:8080/api/paillierKeys').success(function (response) {
                $rootScope.paillierKeys = response
            });
        }
        var msg = '0';
        var n = bigInt($rootScope.paillierKeys.n);
        var n2 = n.pow(2);
        var g = bigInt($rootScope.paillierKeys.g);
        var r1 = bigInt.randBetween(bigInt(0), n);
        var bi1 =  bigInt(msg).mod(n);
        $scope.product.seen = g.modPow(bi1, n2).multiply(r1.modPow(n, n2)).mod(n2).toString(16);

        $http.post('https://localhost:8080/api/ad/add',$scope.product).success(function (res) {
            console.log(res);

            // AHORA SUBIMOS LA FOTO
            if ($scope.myCroppedImage!=''){
                var img = $scope.myCroppedImage;
                var imageBase64 = img;
                var blob = dataURItoBlob(imageBase64);

                function dataURItoBlob(dataURI) {

                    // convert base64/URLEncoded data component to raw binary data held in a string
                    var byteString;
                    if (dataURI.split(',')[0].indexOf('base64') >= 0)
                        byteString = atob(dataURI.split(',')[1]);
                    else
                        byteString = unescape(dataURI.split(',')[1]);

                    // separate out the mime component
                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                    // write the bytes of the string to a typed array
                    var ia = new Uint8Array(byteString.length);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }

                    return new Blob([ia], {type:mimeString});
                }
                var file = new File([blob], 'fileName.jpeg', {type: "image/jpeg"});
                var formData = new FormData();
                formData.append('file', file);
                console.log('FORM DATA');
                console.log(formData);

                $http.post('https://localhost:8080/api/ad/update/' + res._id, formData, {
                        headers: {
                            "Content-type": undefined
                        },
                        transformRequest: angular.identity
                    }
                ).success(function () {
                    $location.path('/products');
                });
            }
            else {
                console.log("SE SUBIRA SOLO FOTO POR DEFECTO");
                $location.path('/products');
            }


        })

    }

}]);




