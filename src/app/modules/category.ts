import { GCrypto } from "./gcrypto";
export class Category {
    _id: string;
    name: string;
    userid: string;

    constructor(category?: Category) {
        if (category == null) {
            this._id = '0';
            this.name = 'Nuova Categoria';
        }
        else {
            this._id = category._id;
            this.name = category.name;
        }
    }

    crypt(key: string) {
        this.name = GCrypto.crypt(this.name, key);
    }

    decrypt(key: string) {
        this.name = GCrypto.decrypt(this.name, key);
    }
}