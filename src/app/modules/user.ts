import { GCrypto } from "./gcrypto";

export class User {
    id: number;
    userhash: string;
    username: string;
    level: number;
    email: string;
    resetpass: number;

    constructor(user?: User) {
        if (user == null) {
            this.username = 'New User';
            var password = 'password';
            this.updateHash(password);
            this.level = 0;
            this.email = '';
            this.resetpass = 1;
        }
        else {
            this.id = user.id;
            this.userhash = user.userhash;
            this.username = user.username;
            this.level = user.level;
            this.email = user.email;
            this.resetpass = user.resetpass;
        }
    }

    updateHash(newPassword: string): void {
        var hash: string = GCrypto.hashUpperCase(newPassword);
        this.userhash = GCrypto.crypt(this.username, hash);
    }
}