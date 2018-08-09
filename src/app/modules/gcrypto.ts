import  * as CryptoJS from '../../../node_modules/crypto-js'

function ascii_to_hexa(str) {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n ++) 
        {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
        }
    return arr1.join('');
}

function hexa_to_ascii(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

export class GCrypto {
    static crypt(text: string, key: string): string {
        const iv_str = "8DCB7300E8BCA8E5";
        const iv = CryptoJS.enc.Hex.parse(ascii_to_hexa(iv_str));
        var crypted = CryptoJS.AES.encrypt(text, CryptoJS.RIPEMD160(key),{
            iv: iv
        });
          
        return crypted.ciphertext.toString().toUpperCase();
    }

    static decrypt(text: string, key: string) {
        const iv_str = "8DCB7300E8BCA8E5";
        const iv = CryptoJS.enc.Hex.parse(ascii_to_hexa(iv_str));
        var cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(text)
            });
        var decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.RIPEMD160(key),{
            iv: iv
        });;
        return decrypted.toString(CryptoJS.enc.Latin1);
    }

    static hash(key: string) {
        return CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex).toUpperCase();
    }
}