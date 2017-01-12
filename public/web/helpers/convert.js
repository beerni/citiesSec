/**
 * Created by scii on 12/01/17.
 */
operations = {
    getModule: function(p, g, number){
    var a = bigInt(g).pow(number);
    return a.mod(p)
    },
    hex2a: function(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
    },
    convertToHex: function(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
    }
};
