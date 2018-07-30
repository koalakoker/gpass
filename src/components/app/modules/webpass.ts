export class WebPass {

    id: number;
    url: string;
    pass: string;
    registeredDate: string;
    expiriatonDate: string;

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

    constructor() {
        const today: Date = new Date();
        const expire: Date = new Date();
        expire.setDate(today.getDate() + 30);
        this.registeredDate = this.format(today);
        this.expiriatonDate = this.format(expire);
    }
}
