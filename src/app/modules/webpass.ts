import { Element } from "./element";
import { GCrypto } from "./gcrypto";

export class WebPass extends Element {

    id: number;
    url: string;
    pass: string;
    registrationDate: string;
    expirationDate: string;

    format(date: Date): string {
        const dd: number = date.getDate();
        const mm: number = date.getMonth() + 1; // January is 0!
        const yyyy: number = date.getFullYear();
        let dds: string;
        let mms: string;
        let days: string;
        if (dd < 10) {
            dds = '0' + dd.toString();
        } else {
            dds = dd.toString();
        }

        if (mm < 10) {
            mms = '0' + mm.toString();
        } else {
            mms = mm.toString();
        }

        days = mms + '/' + dds + '/' + yyyy.toString();
        return days;
    }

    constructor(webPass?: WebPass) {
        super();
        if (webPass == null)
        {
            const today: Date = new Date();
            const expire: Date = new Date();
            expire.setDate(today.getDate() + 30);
            this.registrationDate = this.format(today);
            this.expirationDate = this.format(expire);
        }
        else
        {
            this.id = webPass.id;
            this.url = webPass.url;
            this.pass = webPass.pass;
            this.registrationDate = webPass.registrationDate;
            this.expirationDate = webPass.expirationDate;
        }
    }

    mystr(): string {
        const out: string = "WebPass = id:" + this.id + " url:" + this.url + " pass:" + this.pass + " registration:" + this.registrationDate + " expiration:" + this.expirationDate;
        return out;
    }

    crypt(key: string) {
        this.pass = GCrypto.crypt(this.pass, key);
        this.url = GCrypto.crypt(this.url, key);
    }

    decrypt(key: string) {
        this.pass = GCrypto.decrypt(this.pass, key);
        this.url = GCrypto.decrypt(this.url, key);
    }
}
