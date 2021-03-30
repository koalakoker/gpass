import { MenuItem } from "./menuItem";

export class DropDown {

  public id: string;
  public name: string;
  public minLevel: number;
  public items: Array<MenuItem> = [];

  constructor(id: string, name: string, minLevel: number) {
    this.id = id;
    this.name = name;
    this.minLevel = minLevel;
  }

  public addItem(newItem: MenuItem) {
    this.items.push(newItem);
  }

}