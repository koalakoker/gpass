import {MenuItem, ItemType} from "./menuItem";

export class Divider extends MenuItem {
  
  constructor() {
    super(ItemType.divider);
  }
}