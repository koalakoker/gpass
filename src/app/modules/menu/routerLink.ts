import { MenuItem, ItemType } from './menuItem';

export class RouterLink extends MenuItem  {
  public link: string;
  public label: string;
  public activated: boolean;

  constructor(link: string, label: string, activated: boolean = false) {
    super(ItemType.routerLink);
    this.link = link;
    this.label = label;
    this.activated = activated;
  }

  getActivatedStyle() {
    return this.activated ? "active" : "";
  }
}