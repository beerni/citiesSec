/**
 * Created by Joe on 5/1/17.
 */
angular.module('cities').controller('EditProduct', ['$http', '$scope','$location', function ($http, $scope,$location) {
    console.log('Edit Product controller');


    $scope.product ={};
    init = function () {
        $http.get('https://localhost:8080/api/ad/'+ window.localStorage.getItem('id')).success(function (res) {
            console.log(res);
            $scope.product = res;
            $scope.myCroppedImage = res.imgurl;

        }).error(function (res) {
            console.log("KAPASAOOOOOOO");
        })
    }

    init();

    $scope.myCroppedImage='';
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

    $scope.range_price = function(start,end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.save = function () {
        $http.put('https://localhost:8080/api/ad/' + $scope.product._id, $scope.product).success(function (response) {
            console.log(response);

            //SUBIMOS IMAGEN

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
            console.log(formData);

            $http.post('https://localhost:8080/api/ad/update/' + response._id, formData, {
                    headers: {
                        "Content-type": undefined
                    },
                    transformRequest: angular.identity
                }
            ).success(function () {
                $location.path('/products');
            });
        });

    }




}]);