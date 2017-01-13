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
    },
    correct: function(str){
        var ha = str;
        var a = ha.length;
        var finish= false;
        var comp = false;
        var s = 0;
        var ja = [];
        for(var j = 0; j < a;j++){
            ja.push(ha.substring(s, s+1));
            s=s+1;
        }
        return ja;
    }
};
