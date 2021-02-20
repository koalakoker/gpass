export class User {
    id: number;
    username: string;
    password: string;
    level: number;

    constructor(user?: User) {
        if (user == null) {
            this.username = 'New User';
            this.password = '';
            this.level = 0;
        }
        else {
            this.id = user.id;
            this.username = user.username;
            this.password = user.password;
            this.level = user.level;
        }
    }
}