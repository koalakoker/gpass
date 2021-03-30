export enum ItemType {
  action,
  divider,
  routerLink
}

export class MenuItem {
  
  public type: ItemType;

  constructor(type: ItemType) {
    this.type = type;
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
}