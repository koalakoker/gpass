import { ItemType, MenuItem } from "./menuItem";

export class DropDown extends MenuItem {

  public id: string;
  public name: string;
  public items: Array<MenuItem> = [];

  constructor(id: string, name: string, minLevel: number = 0) {
    super(ItemType.dropDown, minLevel);
    this.id = id;
    this.name = name;
    this.minLevel = minLevel;
  }

  public addItem(newItem: MenuItem) {
    this.items.push(newItem);
  }

}