import { GCrypto } from "./gcrypto";

export class User {
    id: number;
    userhash: string;
    username: string;
    password: string;
    level: number;
    email: string;
    resetpass: number;

    constructor(user?: User) {
        if (user == null) {
            this.username = 'New User';
            this.password = 'password';
            this.changePass(this.password);
            this.level = 0;
            this.email = '';
            this.resetpass = 1;
        }
        else {
            this.id = user.id;
            this.userhash = user.userhash;
            this.username = user.username;
            this.password = user.password;
            this.level = user.level;
            this.email = user.email;
            this.resetpass = user.resetpass;
        }
    }

    changePass(newPassword: string): void {
        var hash: string = GCrypto.hash(newPassword);
        this.userhash = GCrypto.crypt(this.username, hash);
    }
}