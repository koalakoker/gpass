import { ItemType, MenuItem } from "./menuItem";

export class DropDown extends MenuItem {

  private items: Array<MenuItem> = [];
  public id: string;
  public name: string;

  constructor(id: string, name: string, minLevel: number = 0) {
    super(ItemType.dropDown, minLevel);
    this.id = id;
    this.name = name;
    this.minLevel = minLevel;
  }

  public getItems(): Array<MenuItem> {
    return this.items;
  }

  public addItem(newItem: MenuItem): void {
    this.items.push(newItem);
  }

  public clear(): void {
    this.items = [];
  }

}