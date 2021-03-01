import { ResolvedStaticSymbol } from '@angular/compiler';
import  * as CryptoJS from '../../../node_modules/crypto-js'
import { WebService } from '../services/web.service';

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

function ToInteger(x) {
    x = Number(x);
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}

function modulo(a, b) {
    return a - Math.floor(a / b) * b;
}

function ToUint32(x) {
    return modulo(ToInteger(x), Math.pow(2, 32));
}

function ToInt32(x) {
    var uint32 = ToUint32(x);
    if (uint32 >= Math.pow(2, 31)) {
        return uint32 - Math.pow(2, 32)
    } else {
        return uint32;
    }
}

function chipherString(text: string) {
    var words = strHex_to_words(text);
    return {
            ciphertext: {
                words: words,
                sigBytes: 4 * words.length
            }
        };
}

function strHex_to_words(str: string): Number[] {
    var out: Number[] = [];
    for (let index = 0; index < str.length / 8; index++) {
        var sub = str.substring(0 + (index * 8), 8 + (index * 8));
        var yourNumber: number = parseInt(sub, 16);
        out.push(ToInt32(yourNumber));
    }
    return out;
}

export class GCrypto {
    
    constructor(
        private configService: WebService
    ) { }

    static crypt(text: string, key: string): string {
        if (text === undefined)
            return '';
        const iv_str = "8DCB7300E8BCA8E5";
        const iv = CryptoJS.enc.Hex.parse(ascii_to_hexa(iv_str));
        var crypted = CryptoJS.AES.encrypt(text, CryptoJS.RIPEMD160(key),{
            iv: iv
        });
          
        return crypted.ciphertext.toString().toUpperCase();
    }

    static decrypt(text: string, key: string): string {
        if (text === undefined)
        return '';
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

    static cryptDBAccess(text: string, key: string): string {
        const iv_str = "8DCB7300E8BCA8E5";
        const iv = CryptoJS.enc.Hex.parse(ascii_to_hexa(iv_str));
        var crypted = CryptoJS.AES.encrypt(text, CryptoJS.SHA256(key),{
            iv: iv
        });
          
        return crypted.ciphertext.toString().toUpperCase();
    }

    cryptPass(pass: string, callback : (crypted: string) => void) {
        const url: string = 'https://worldtimeapi.org/api/timezone/Europe/Rome';
        this.configService.apiGet(url).subscribe( (data: JSON)=> {
            const dateStr: string = data['datetime'].slice(0, 16);
            const secret = 'f775aaf9cfab2cd30fd0d0ad28c5c460';
            var hash = CryptoJS.HmacSHA256(dateStr, secret);
            const iv_str = "8DCB7300E8BCA8E5";
            const iv = CryptoJS.enc.Hex.parse(ascii_to_hexa(iv_str));
            var crypted = CryptoJS.AES.encrypt(pass, (hash), {
                 iv: iv
             });
            const encrypted = crypted.ciphertext.toString();
            callback(crypted.ciphertext.toString());
        }, err => {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        });
    }

    promise_cryptText(strList: string[], duration: string = '') {
        var charIndex = 16;
        if (duration == 'Month') {
            charIndex = 7;
        }
        const url: string = 'https://worldtimeapi.org/api/timezone/Europe/Rome';
        return new Promise<string[]>((resolve, reject) => {
            this.configService.apiGet(url).toPromise()
                .then((data: JSON) => {
                    const dateStr: string = data['datetime'].slice(0, charIndex);
                    const secret = 'f775aaf9cfab2cd30fd0d0ad28c5c460';
                    var hash = CryptoJS.HmacSHA256(dateStr, secret);
                    const iv_str = "8DCB7300E8BCA8E5";
                    const iv = CryptoJS.enc.Hex.parse(ascii_to_hexa(iv_str));
                    
                    var encrypted: string[] = [];
                    strList.forEach(str => {
                        var crypted = CryptoJS.AES.encrypt(str, (hash), {
                            iv: iv
                        });
                        encrypted.push(crypted.ciphertext.toString());
                    });
                    resolve(encrypted);
                })
                .catch((err) => {
                    reject(err)
                });

        }) 
    }

    test(strList) {
        const url: string = 'https://worldtimeapi.org/api/timezone/Europe/Rome';
        var charIndex = 7;
        this.configService.apiGet(url).toPromise()
            .then((data: JSON) => {
                const dateStr: string = data['datetime'].slice(0, charIndex);
                const secret = 'f775aaf9cfab2cd30fd0d0ad28c5c460';
                var hash = CryptoJS.HmacSHA256(dateStr, secret);
                const iv_str = "8DCB7300E8BCA8E5";
                const iv = CryptoJS.enc.Hex.parse(ascii_to_hexa(iv_str));
        
                //var text = "Precivitevolissimo evolmentte. Nelmezzo del cammin di nostra vita mi ritrovai per una selva oscura!";
            
                strList.forEach(text => {
                    
                    
                    // var crypted = CryptoJS.AES.encrypt(text, hash, {
                    //     iv: iv
                    // });
                        
                    // var text = crypted.ciphertext.toString();
                    console.log(text);
                        
                    var decrypt = CryptoJS.AES.decrypt(chipherString(text), hash, {iv:iv});
                    console.log("Finally I get this:",decrypt.toString(CryptoJS.enc.Utf8));
                });
            });
    }

    promise_deCryptText(strList: string[], duration: string = '') {
        var charIndex = 16;
        if (duration == 'Month') {
            charIndex = 7;
        }
        const url: string = 'https://worldtimeapi.org/api/timezone/Europe/Rome';
        return new Promise<string[]>((resolve, reject) => {
            this.configService.apiGet(url).toPromise()
                .then((data: JSON) => {
                    const dateStr: string = data['datetime'].slice(0, charIndex);
                    console.log(dateStr);
                    const secret = 'f775aaf9cfab2cd30fd0d0ad28c5c460';
                    var hash = CryptoJS.HmacSHA256(dateStr, secret);
                    const iv_str = "8DCB7300E8BCA8E5";
                    const iv = CryptoJS.enc.Hex.parse(ascii_to_hexa(iv_str));

                    var deCryptedList: string[] = [];
                    strList.forEach(str => {
                        var deCrypted = CryptoJS.AES.decrypt(chipherString(str), hash, { iv: iv }).toString(CryptoJS.enc.Utf8);
                        console.log(str);
                        console.log("Finally got this:",deCrypted);
                        deCryptedList.push(deCrypted);
                    });
                    resolve(deCryptedList);
                })
                .catch((err) => {
                    reject(err)
                });

        })
    }
}