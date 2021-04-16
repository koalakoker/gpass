import { MenuItem } from "../menu/menuItem";

export class Menu extends Array<MenuItem> {
  
  constructor() {
    super();
  }

  public addElement(item: MenuItem): void {
    this.push(item);
  }

  public findElementByTag(tag: string): MenuItem {
    let found: MenuItem;
    this.forEach(item => {
      if (item.tag === tag) {
        found = item;
      }
    });
    return found;
  }
}