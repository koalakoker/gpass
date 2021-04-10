import { MenuItem, ItemType, ItemState } from "./menuItem";

interface ActionParameters {
  name     : string;
  onClick  : any;
  minLevel?: number;
  state   ?: ItemState;
}

export class Action extends MenuItem {

  public name: string;
  public onClick: any;

  constructor({name, onClick, minLevel = 0, state = ItemState.enabled}: ActionParameters) {
    super(ItemType.action, minLevel);
    this.name = name;
    this.onClick = onClick;
    this.state = state;
  }

}