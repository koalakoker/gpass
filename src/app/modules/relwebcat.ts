export class RelWebCat {
    id_webcatrel: number;
    id_web: number;
    id_cat: number;
    enabled: boolean;

    constructor(rel?: RelWebCat) {
        if (rel == null) {
            this.id_webcatrel = 0;
            this.id_web       = 0;
            this.id_cat       = 0;
            this.enabled      = true;
        }
        else {
            this.id_webcatrel = rel.id_webcatrel;
            this.id_web       = rel.id_web;
            this.id_cat       = rel.id_cat;
            this.enabled      = rel.enabled;
        }
    }
}