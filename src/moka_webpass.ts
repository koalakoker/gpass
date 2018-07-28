import { WebPass } from './webpass';

export class WebPassList {

    constructor() {
        this.list = new Array<WebPass>();
        for (let index = 0; index < 3; index++) {
            const webPass: WebPass = new WebPass();
            webPass.url = 'www.url' + index.toString() + '.com';
            webPass.pass = 'xxxx';
            this.list.push(webPass);
        }
    }

    list: WebPass[];

    getList(): WebPass[] {
        return this.list;
    }
}
