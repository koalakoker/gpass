import { EventEmitter } from '@angular/core';

export interface Refreshable {
    refresh: (string) => Promise<RefreshReturnData>;
    queryForAction(string): boolean;
    hasChanged: EventEmitter <string>;
}

export class RefreshReturnData {
    pageCode: string;
    childInject: string;

    constructor(pageCode?: string) {
        if (pageCode !== undefined) {
            this.pageCode = pageCode;
        } else {
            this.pageCode = "";
        }
        this.childInject = "";
    }
}