import { MenuItem, ItemType } from "./menuItem";

export class Action extends MenuItem {

  public name: string;
  public onClick: any;

  constructor(name: string, onClick: any) {
    super(ItemType.action);
    this.name = name;
    this.onClick = onClick;
  }

}