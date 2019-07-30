import { GCrypto } from "./gcrypto";

export class WebPass {

    id: number;
    name: string;
    url: string;
    username: string;
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
        if (webPass == null)
        {
            this.id          = 0;
            this.name        = '';
            this.url         = '';
            this.username    = '';
            this.pass        = '';
            this.setToday();
        }
        else
        {
            this.id =               webPass.id;
            this.name =             webPass.name;
            this.url =              webPass.url;
            this.username =         webPass.username;
            this.pass =             webPass.pass;
            this.registrationDate = webPass.registrationDate;
            this.expirationDate =   webPass.expirationDate;
        }
    }

    setToday() {
        const today: Date = new Date();
        const expire: Date = new Date();
        expire.setDate(today.getDate() + 30);
        this.registrationDate = this.format(today);
        this.expirationDate = this.format(expire);
    }

    isExpired(): boolean {
        const today: Date = new Date();
        const expirationDate: Date = new Date(this.expirationDate);
        return (today > expirationDate);
    }

    crypt(key: string) {
        this.name             = GCrypto.crypt(this.name,             key);
        this.url              = GCrypto.crypt(this.url,              key);
        this.username         = GCrypto.crypt(this.username,         key);
        this.pass             = GCrypto.crypt(this.pass,             key);
        this.registrationDate = GCrypto.crypt(this.registrationDate, key);
        this.expirationDate   = GCrypto.crypt(this.expirationDate,   key);
    }

    decrypt(key: string) {
        this.name             = GCrypto.decrypt(this.name,             key);
        this.url              = GCrypto.decrypt(this.url,              key);
        this.username         = GCrypto.decrypt(this.username,         key);
        this.pass             = GCrypto.decrypt(this.pass,             key);
        this.registrationDate = GCrypto.decrypt(this.registrationDate, key);
        this.expirationDate   = GCrypto.decrypt(this.expirationDate,   key);
    }
}
