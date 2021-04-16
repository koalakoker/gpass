import { MenuItem, ItemType, ItemState } from "./menuItem";

interface ActionParameters {
  tag      : string;
  label    : string;
  onClick  : any;
  minLevel?: number;
  state   ?: ItemState;
}

export class Action extends MenuItem {

  public label: string;
  public onClick: any;

  constructor({tag, label, onClick, minLevel = 0, state = ItemState.enabled}: ActionParameters) {
    super(ItemType.action, tag, minLevel);
    this.label = label;
    this.onClick = onClick;
    this.state = state;
  }

}