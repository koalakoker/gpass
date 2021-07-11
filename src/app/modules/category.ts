export class Category {
    _id: string;
    name: string;
    userid: number;

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
}