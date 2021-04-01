import { MenuItem, ItemType } from "./menuItem";

export class Action extends MenuItem {

  public name: string;
  public onClick: any;

  constructor(name: string, onClick: any, minLevel: number = 0) {
    super(ItemType.action, minLevel);
    this.name = name;
    this.onClick = onClick;
  }

}