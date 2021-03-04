export class Category {
    id: number;
    name: string;
    userid: number;

    constructor(category?: Category) {
        if (category == null) {
            this.id = 0;
            this.name = 'Nuova Categoria';
        }
        else {
            this.id = category.id;
            this.name = category.name;
        }
    }
}