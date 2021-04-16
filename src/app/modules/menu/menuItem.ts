export enum ItemType {
  action,
  divider,
  routerLink,
  dropDown
}

export enum ItemState {
  enabled,
  disabled
}

export class MenuItem {
  
  public tag: string;
  public type: ItemType;
  public minLevel: number;
  public index: number;
  public state: ItemState = ItemState.enabled;
  public visible: boolean;
  private static newIndex: number = 0;

  constructor(type: ItemType, tag: string, minLevel: number = 0) {
    this.type = type;
    this.tag = tag;
    this.minLevel = minLevel;
    this.index = MenuItem.newIndex;
    this.visible = true;
    MenuItem.newIndex += 1;
  }

  isAction() {
    return (this.type === ItemType.action);
  }

  isDivider() {
    return (this.type === ItemType.divider);
  }

  isRouterLink() {
    return (this.type === ItemType.routerLink);
  }

  isDropDown() {
    return (this.type === ItemType.dropDown);
  }

  isEnabled() {
    return (this.state === ItemState.enabled);
  }

  isDisabled() {
    return (this.state === ItemState.disabled);
  }
}