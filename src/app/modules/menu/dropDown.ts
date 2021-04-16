import { ItemType, MenuItem } from "./menuItem";

export class DropDown extends MenuItem {

  private items: Array<MenuItem> = [];
  public label: string;

  constructor(tag: string, label: string, minLevel: number = 0) {
    super(ItemType.dropDown, tag, minLevel);
    this.tag = tag;
    this.label = label;
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