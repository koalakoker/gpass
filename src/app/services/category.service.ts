import { Injectable } from '@angular/core';
import { Category } from '../modules/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private mockup: Array<Category> = [];
  private mockupId: number = 0;

  constructor() {
  }

  getFromUserCategory(): Promise<Array<Category>> {
    return new Promise<Array<Category>>((resolve, reject) => {
      const categories = this.mockup;
      categories.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else {
          if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        }
      })
      resolve(categories);
    });
  }

  createCategory(category: Category): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.mockup.push(category);
      this.mockupId++;
      resolve(this.mockupId);
    })
  }

  deleteCategory(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const category = this.mockup.find((cat) => {
        return cat.id === id;
      });
      const index = this.mockup.indexOf(category);
      this.mockup.splice(index, 1);
    });
  }

  updateCategory(id: number, categoryUpdated: Category): Promise<Category> {
    return new Promise<Category>((resolve, reject) => {
      const category = this.mockup.find((cat) => {
        return cat.id === id;
      });
      const index = this.mockup.indexOf(category);
      this.mockup[index] = categoryUpdated;
      resolve(categoryUpdated);
    });
  }

}