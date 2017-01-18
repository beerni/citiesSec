/**
 * Created by bernatmir on 28/12/16.
 */
angular.module('cities').controller('AnonimousController', ['$http', '$scope', '$window', '$cookies', '$rootScope','$location','socketio', function ($http, $scope, $window, $cookies, $rootScope,$location,socket) {
    if(angular.isUndefined($cookies.getObject('tokenData'))){
        $rootScope.isLogged=false;

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
                $location.path('/shop');
            }
            else{
                console.log("NO TOKEN");
                $rootScope.isLogged=false;
                $location.path('/login');
            }
        })
    }

    !function (a) {
        function b(b, d) {
            function e() {
                if (w) {
                    $canvas = a('<canvas class="pg-canvas"></canvas>'), v.prepend($canvas), p = $canvas[0], q = p.getContext("2d"), f();
                    for (var b = Math.round(p.width * p.height / d.density), c = 0; b > c; c++) {
                        var e = new l;
                        e.setStackPos(c), x.push(e)
                    }
                    a(window).on("resize", function () {
                        h()
                    }), a(document).on("mousemove", function (a) {
                        y = a.pageX, z = a.pageY
                    }), B && !A && window.addEventListener("deviceorientation", function () {
                        D = Math.min(Math.max(-event.beta, -30), 30), C = Math.min(Math.max(-event.gamma, -30), 30)
                    }, !0), g(), o("onInit")
                }
            }

            function f() {
                p.width = v.width(), p.height = v.height(), q.fillStyle = d.dotColor, q.strokeStyle = d.lineColor, q.lineWidth = d.lineWidth
            }

            function g() {
                if (w) {
                    s = a(window).width(), t = a(window).height(), q.clearRect(0, 0, p.width, p.height);
                    for (var b = 0; b < x.length; b++)x[b].updatePosition();
                    for (var b = 0; b < x.length; b++)x[b].draw();
                    E || (r = requestAnimationFrame(g))
                }
            }

            function h() {
                for (f(), i = x.length - 1; i >= 0; i--)(x[i].position.x > v.width() || x[i].position.y > v.height()) && x.splice(i, 1);
                var a = Math.round(p.width * p.height / d.density);
                if (a > x.length)for (; a > x.length;) {
                    var b = new l;
                    x.push(b)
                } else a < x.length && x.splice(a);
                for (i = x.length - 1; i >= 0; i--)x[i].setStackPos(i)
            }

            function j() {
                E = !0
            }

            function k() {
                E = !1, g()
            }

            function l() {
                switch (this.stackPos, this.active = !0, this.layer = Math.ceil(3 * Math.random()), this.parallaxOffsetX = 0, this.parallaxOffsetY = 0, this.position = {
                    x: Math.ceil(Math.random() * p.width),
                    y: Math.ceil(Math.random() * p.height)
                }, this.speed = {}, d.directionX) {
                    case"left":
                        this.speed.x = +(-d.maxSpeedX + Math.random() * d.maxSpeedX - d.minSpeedX).toFixed(2);
                        break;
                    case"right":
                        this.speed.x = +(Math.random() * d.maxSpeedX + d.minSpeedX).toFixed(2);
                        break;
                    default:
                        this.speed.x = +(-d.maxSpeedX / 2 + Math.random() * d.maxSpeedX).toFixed(2), this.speed.x += this.speed.x > 0 ? d.minSpeedX : -d.minSpeedX
                }
                switch (d.directionY) {
                    case"up":
                        this.speed.y = +(-d.maxSpeedY + Math.random() * d.maxSpeedY - d.minSpeedY).toFixed(2);
                        break;
                    case"down":
                        this.speed.y = +(Math.random() * d.maxSpeedY + d.minSpeedY).toFixed(2);
                        break;
                    default:
                        this.speed.y = +(-d.maxSpeedY / 2 + Math.random() * d.maxSpeedY).toFixed(2), this.speed.x += this.speed.y > 0 ? d.minSpeedY : -d.minSpeedY
                }
            }

            function m(a, b) {
                return b ? void(d[a] = b) : d[a]
            }

            function n() {
                v.find(".pg-canvas").remove(), o("onDestroy"), v.removeData("plugin_" + c)
            }

            function o(a) {
                void 0 !== d[a] && d[a].call(u)
            }

            var p, q, r, s, t, u = b, v = a(b), w = !!document.createElement("canvas").getContext, x = [], y = 0, z = 0, A = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), B = !!window.DeviceOrientationEvent, C = 0, D = 0, E = !1;
            return d = a.extend({}, a.fn[c].defaults, d), l.prototype.draw = function () {
                q.beginPath(), q.arc(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY, d.particleRadius / 2, 0, 2 * Math.PI, !0), q.closePath(), q.fill(), q.beginPath();
                for (var a = x.length - 1; a > this.stackPos; a--) {
                    var b = x[a], c = this.position.x - b.position.x, e = this.position.y - b.position.y, f = Math.sqrt(c * c + e * e).toFixed(2);
                    f < d.proximity && (q.moveTo(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY), d.curvedLines ? q.quadraticCurveTo(Math.max(b.position.x, b.position.x), Math.min(b.position.y, b.position.y), b.position.x + b.parallaxOffsetX, b.position.y + b.parallaxOffsetY) : q.lineTo(b.position.x + b.parallaxOffsetX, b.position.y + b.parallaxOffsetY))
                }
                q.stroke(), q.closePath()
            }, l.prototype.updatePosition = function () {
                if (d.parallax) {
                    if (B && !A) {
                        var a = (s - 0) / 60;
                        pointerX = (C - -30) * a + 0;
                        var b = (t - 0) / 60;
                        pointerY = (D - -30) * b + 0
                    } else pointerX = y, pointerY = z;
                    this.parallaxTargX = (pointerX - s / 2) / (d.parallaxMultiplier * this.layer), this.parallaxOffsetX += (this.parallaxTargX - this.parallaxOffsetX) / 10, this.parallaxTargY = (pointerY - t / 2) / (d.parallaxMultiplier * this.layer), this.parallaxOffsetY += (this.parallaxTargY - this.parallaxOffsetY) / 10
                }
                switch (d.directionX) {
                    case"left":
                        this.position.x + this.speed.x + this.parallaxOffsetX < 0 && (this.position.x = v.width() - this.parallaxOffsetX);
                        break;
                    case"right":
                        this.position.x + this.speed.x + this.parallaxOffsetX > v.width() && (this.position.x = 0 - this.parallaxOffsetX);
                        break;
                    default:
                        (this.position.x + this.speed.x + this.parallaxOffsetX > v.width() || this.position.x + this.speed.x + this.parallaxOffsetX < 0) && (this.speed.x = -this.speed.x)
                }
                switch (d.directionY) {
                    case"up":
                        this.position.y + this.speed.y + this.parallaxOffsetY < 0 && (this.position.y = v.height() - this.parallaxOffsetY);
                        break;
                    case"down":
                        this.position.y + this.speed.y + this.parallaxOffsetY > v.height() && (this.position.y = 0 - this.parallaxOffsetY);
                        break;
                    default:
                        (this.position.y + this.speed.y + this.parallaxOffsetY > v.height() || this.position.y + this.speed.y + this.parallaxOffsetY < 0) && (this.speed.y = -this.speed.y)
                }
                this.position.x += this.speed.x, this.position.y += this.speed.y
            }, l.prototype.setStackPos = function (a) {
                this.stackPos = a
            }, e(), {option: m, destroy: n, start: k, pause: j}
        }

        var c = "particleground";
        a.fn[c] = function (d) {
            if ("string" == typeof arguments[0]) {
                var e, f = arguments[0], g = Array.prototype.slice.call(arguments, 1);
                return this.each(function () {
                    a.data(this, "plugin_" + c) && "function" == typeof a.data(this, "plugin_" + c)[f] && (e = a.data(this, "plugin_" + c)[f].apply(this, g))
                }), void 0 !== e ? e : this
            }
            return "object" != typeof d && d ? void 0 : this.each(function () {
                a.data(this, "plugin_" + c) || a.data(this, "plugin_" + c, new b(this, d))
            })
        }, a.fn[c].defaults = {
            minSpeedX: .1,
            maxSpeedX: .7,
            minSpeedY: .1,
            maxSpeedY: .7,
            directionX: "center",
            directionY: "center",
            density: 1e4,
            dotColor: "#666666",
            lineColor: "#666666",
            particleRadius: 7,
            lineWidth: 1,
            curvedLines: !1,
            proximity: 100,
            parallax: !0,
            parallaxMultiplier: 5,
            onInit: function () {
            },
            onDestroy: function () {
            }
        }
    }(jQuery), /**
     */
        function () {
            for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c)window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
            window.requestAnimationFrame || (window.requestAnimationFrame = function (b) {
                var c = (new Date).getTime(), d = Math.max(0, 16 - (c - a)), e = window.setTimeout(function () {
                    b(c + d)
                }, d);
                return a = c + d, e
            }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (a) {
                clearTimeout(a)
            })
        }();

    $(function () {

        $('#particles').particleground({
            minSpeedX: 0.3,
            maxSpeedX: 1.1,
            minSpeedY: 0.3,
            maxSpeedY: 1.1,
            directionX: 'center', // 'center', 'left' or 'right'. 'center' = dots bounce off edges
            directionY: 'center', // 'center', 'up' or 'down'. 'center' = dots bounce off edges
            density: 5000, // How many particles will be generated: one particle every n pixels
            dotColor: '#D6D6D6',
            lineColor: '#D6D6D6',
            particleRadius: 5, // Dot size
            lineWidth: 1,
            curvedLines: true,
            proximity: 120, // How close two dots need to be before they join
            parallax: false
        });

    });
    $scope.user = {};
    var urlServer = 'https://localhost:8080/api';
    var rand;
    var unblind;

    function convertToHex(str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
    }

    function hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    function compareHash(info, cb) {
        var concat = info.A + '|' + info.B + '|' + info.username + '|' + info.password;
        var eTTP = bigInt(info.eTTP);
        var nTTP = bigInt(info.nTTP);
        var originHash = CryptoJS.SHA256(concat).toString();
        var originServer = bigInt(info.proof);
        var decrypted = originServer.modPow(eTTP, nTTP).toString(16);
        if (decrypted.localeCompare(originHash) == 0) {
            console.log('Equal hashes from proof!');
            console.log(decrypted.toString(16));
            console.log(originHash.toString(16));
            cb();
        }
        else
            console.log('mismatch');
    }

    function register() {
        var username, password;
        swal({
                title: "Username",
                text: "Write your username",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "Username"
            },
            function (inputValue) {
                if (inputValue === false) return false;

                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false
                }
                if (inputValue) {
                    username = inputValue;
                    $http.post(urlServer + '/user/register/anonimous', {
                        username: username,
                        checkUsername: true
                    }).success(function (res) {
                        inputValue = null;
                        swal({
                                title: "Password",
                                text: "Write your password",
                                type: "input",
                                showCancelButton: true,
                                closeOnConfirm: false,
                                animation: "slide-from-top",
                                inputPlaceholder: "Password"
                            },
                            function (inputValue) {
                                if (inputValue === false) return false;

                                if (inputValue === "") {
                                    swal.showInputError("You need to write something!");
                                    return false
                                }
                                if (inputValue) {
                                    password = inputValue;
                                    $http.post(urlServer + '/user/register/anonimous', {
                                        username: username,
                                        password: password,
                                        checkUsername: false
                                    }).success(function (res) {
                                        $http.get('https://localhost:8085/ttp/publication').success(function (res) {
                                            if (username === res.username && password === password) {
                                                compareHash(res, function () {
                                                    swal("Well done!", "Your user is registered!", "success")
                                                    $cookies.remove('canLogin');

                                                })
                                            }
                                        })
                                    }).error(function (res) {

                                    })
                                }
                            });
                    }).error(function (err) {
                        swal.showInputError("This username exists!");
                        return false
                    });

                }
            });


    }

    $scope.getToken = function () {

        if ($cookies.get('canLogin')) {
            $http.get(urlServer + '/publickey').success(function (response) {
                $rootScope.serverPublic = response;
                var n = response.n;
                var e = response.e;
                //Blinding message
                var clientPublic = $rootScope.clientKeys.publicKey;
                var concat = 'clientKey' + ':' + clientPublic.n.toString();
                concat = concat.substring(0, 50);
                rand = bigInt.randBetween(2, n - 1);
                var publicToHex = bigInt(convertToHex(concat), 16);
                var publicBlinded = (publicToHex.multiply(rand.modPow(e, n))).mod(n);
                publicBlinded = publicBlinded.toString(16);
                $http.post(urlServer + '/sign', {data: publicBlinded}).success(function (res) {
                    var msgSigned = bigInt(res.data, 16);

                    //Token
                    unblind = (msgSigned.multiply(rand.modInv(n))).mod(n);

                    //Comprovacions
                    // var decryptMsg = unblind.modPow(e, n).toString(16);
                    //console.log(hex2a(decryptMsg));
                    $http.post(urlServer + '/sign/verify', {data: unblind.toString()}).success(function (res) {
                        var data = {
                            challenge: $rootScope.clientKeys.privateKey.sign(bigInt(convertToHex(res), 16)).toString(),
                            e: $rootScope.clientKeys.publicKey.e.toString(),
                            n: $rootScope.clientKeys.publicKey.n.toString()
                        };
                        $http.post(urlServer + '/challenge', {data: data}).success(function (res) {
                            swal({
                                    title: "Verify token",
                                    text: "Submit to verify your token",
                                    type: "info",
                                    showCancelButton: true,
                                    closeOnConfirm: false,
                                    showLoaderOnConfirm: true,
                                },
                                function () {
                                    setTimeout(function () {
                                        swal({
                                                title: "Token verified",
                                                text: unblind.toString(16).substring(0, 50),
                                                confirmButtonText: "Register!",
                                                closeOnConfirm: false,
                                                closeOnCancel: false
                                            },
                                            function (isConfirm) {
                                                if (isConfirm) {
                                                    register();
                                                }
                                            });
                                    }, 2000);
                                });

                        }).error(function (err) {
                            sweetAlert("Error...", "Validating signature!", "error");

                        })
                    }).error(function (err) {
                        sweetAlert("Error...", "Validating signature!", "error");
                    })
                });
            });
        }
        else {
            //console.log('No tiene cookie!');
            swal({
                title: "It seems you are not registered!",
                text: "Redirecting to register page.",
                timer: 5000,
                type: "error",
                showConfirmButton: false
            });
            $window.location.href = "https://localhost:8080/#/login";

        }
    };

    $scope.login = function () {
        if ($scope.user.username == undefined || $scope.user.password == undefined) {
            sweetAlert("Oops...", "Introduce something!", "error");
        }
        else {
            var login = {
                username: $scope.user.username,
                password: $scope.user.password
            };
            $http.post(urlServer + '/user/login', login).success(function (res) {
                $rootScope.token = {
                    headers: {
                        'x-access-token': res.token
                    }
                };
                $cookies.put('tokenData', JSON.stringify(res));
                var userLogged = JSON.parse($cookies.get('tokenData'));
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
                socket.connect();
                socket.emit('connection');
                if ($window.location.href != "https://localhost:8080") {
                    $cookies.remove('user');
                    socket.on('connection', function (data) {
                        socket.emit('username', userLogged.user.username);
                    });
                }
                $window.location.href = 'https://localhost:8080/#/shop'

            }).error(function (res) {
                console.log(res);
                if (res == 'Not Found') {
                    sweetAlert("Oops...", "This username is not registered!", "error");
                    $scope.user = null;
                }
                if (res == 'Bad Request') {
                    sweetAlert("Oops...", "Error in your password", "error");
                    $scope.user.password = null;
                }

            });
        }
    };


    //Funcions de prova amb token
    $scope.test = function () {
        $http.post(urlServer + '/user/loginTest', {}, $rootScope.token).success(function (res) {
        });
    };
    $scope.sinJSON = function () {
        $http.post(urlServer + '/user/loginTest', {}).success(function (res) {
            console.log(res);
        }).error(function (err,status) {
           if(status==403){
               swal({
                       title: "It seems you are not allowed!",
                       text: "Redirecting to mean page.",
                       timer: 2000,
                       type: "error",
                       showConfirmButton: false
                   },
                   function () {
                       setTimeout(function () {
                          $window.location.href = 'https://localhost:8080'
                       }, 2000);
                   });
           }
        });
    }
}]);
