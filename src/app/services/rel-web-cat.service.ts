import { Injectable } from '@angular/core';
import { RelWebCat } from '../modules/relwebcat';

@Injectable({
  providedIn: 'root'
})
export class RelWebCatService {

  private mockup: Array<RelWebCat> = [];
  private mockupId: number = 0;

  constructor() { }

  getWebCatRel(): Promise<Array<RelWebCat>> {
    return new Promise<Array<RelWebCat>>((resolve, reject) => {
      resolve(this.mockup);
    });
  }

  updateRelWebCat(id: number, rel: RelWebCat): Promise<RelWebCat> {
    return new Promise<RelWebCat>((resolve, reject) => {
      const relWebCat = this.mockup.find((relation) => {
        return relation.id === id;
      });
      const index = this.mockup.indexOf(relWebCat);
      this.mockup[index] = rel;
      resolve(rel);
    });
  }

  createRelWebCat(rel: RelWebCat): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.mockup.push(rel);
      this.mockupId++;
      resolve(this.mockupId);
    })
  }
}
