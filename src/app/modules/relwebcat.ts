export class RelWebCat {
    id: number;
    id_web: number;
    id_cat: number;
    enabled: number;

    constructor(rel?: RelWebCat) {
        if (rel == null) {
            this.id       = 0;
            this.id_web   = 0;
            this.id_cat   = 0;
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