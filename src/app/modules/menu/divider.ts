import {MenuItem, ItemType} from "./menuItem";

export class Divider extends MenuItem {
  
  constructor(tag: string) {
    super(ItemType.divider, tag);
  }
}