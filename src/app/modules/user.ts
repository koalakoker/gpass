import { GCrypto } from "./gcrypto";

export class User {
    _id?: string;
    password?: string;
    name?: string;
    isAdmin?: boolean;
    email?: string;
    resetpass?: boolean;

    constructor(user?: User) {
        if (user == null) {
            this.name = 'New User';
            var password = 'password';
            //this.updateHash(password);
            this.isAdmin = false;
            this.email = '';
            this.resetpass = false;
        }
        else {
            this._id = user._id;
            this.password = user.password;
            this.name = user.name;
            this.isAdmin = user.isAdmin;
            this.email = user.email;
            this.resetpass = user.resetpass;
        }
    }

    updateHash(newPassword: string): void {
        var hash: string = GCrypto.hashUpperCase(newPassword);
        this.password = GCrypto.crypt(this.name, hash);
    }
}