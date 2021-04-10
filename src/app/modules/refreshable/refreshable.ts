import { EventEmitter } from '@angular/core';

export interface Refreshable {
    refresh: (string) => Promise<RefreshReturnData>;
    queryForAction(string): boolean;
    hasChanged: EventEmitter <void>;
}

export class RefreshReturnData {
    pageCode: string;
    childInject: string;

    constructor() {
        this.pageCode = "";
        this.childInject = "";
    }
}