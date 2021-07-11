export class RelWebCat {
    id: number;
    id_web: string;
    id_cat: string;
    enabled: number;

    constructor(rel?: RelWebCat) {
        if (rel == null) {
            this.id       = 0;
            this.id_web   = '';
            this.id_cat   = '0';
            this.enabled  = 1;
        }
        else {
            this.id      = rel.id;
            this.id_web  = rel.id_web;
            this.id_cat  = rel.id_cat;
            this.enabled = rel.enabled;
        }
    }
}