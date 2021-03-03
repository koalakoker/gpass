export interface Refreshable {
    refresh: (string) => Promise<RefreshReturnData>;
}

export class RefreshReturnData {
    pageCode: string;
    childInject: string;

    constructor() {
        this.pageCode = "";
        this.childInject = "";
    }
}