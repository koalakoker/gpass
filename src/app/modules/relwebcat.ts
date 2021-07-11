export class RelWebCat {
    _id: string;
    id_web: string;
    id_cat: string;
    enabled: number;

    constructor(rel?: RelWebCat) {
        if (rel == null) {
            this._id       = '';
            this.id_web   = '';
            this.id_cat   = '0';
            this.enabled  = 1;
        }
        else {
            this._id      = rel._id;
            this.id_web  = rel.id_web;
            this.id_cat  = rel.id_cat;
            this.enabled = rel.enabled;
        }
    }
}