import { EventEmitter } from '@angular/core';

export interface Refreshable {
    refresh: (string) => Promise<RefreshReturnData>;
    hasChanged: EventEmitter < void>;
}

export class RefreshReturnData {
    pageCode: string;
    childInject: string;

    constructor() {
        this.pageCode = "";
        this.childInject = "";
    }
}