import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActionsQuery } from 'src/app/components/navbar/actionsQuery';
import { Category } from 'src/app/modules/category';
import { Action } from 'src/app/modules/menu/action';
import { ActionSignal } from './actionSignal';
import { Divider } from 'src/app/modules/menu/divider';
import { DropDown } from 'src/app/modules/menu/dropDown';
import { Menu } from 'src/app/modules/menu/menu';
import { RouterLink } from 'src/app/modules/menu/routerLink';
import { User } from 'src/app/modules/user';
import { CategoryService } from 'src/app/services/api/category.service';
import { LoginService } from 'src/app/services/api/login.service';
import { UserService } from 'src/app/services/api/user.service';
import { MessageBoxService } from 'src/app/services/message-box.service';
import * as PageCodes from '../../modules/refreshable/pagesCodes';
import { ComboBoxComponent } from '../combo-box/combo-box.component';
import { LoginComponent } from '../login/login.component';

enum AppState {
  notLogged,
  logged
}

enum MenuItemTag {
  webPass = "webPass",
  webPass_all = "webPass_all",
  webPass_new = "webPass_new",
  webPass_plusOneYearAll = "webPass_plusOneYearAll",
  webPass_deleteAll = "webPass_deleteAll",
  webPass_logOut = "webPass_logOut",
  webPass_divider1 = "webPass_divider1",
  webPass_export = "webPass_export",
  webPass_import = "webPass_import",

  notes = "notes",
  notes_new = "notes_new",

  category = "category",
  category_new = "category_new",

  users = "users",
  users_new = "users_new",

  admin = "admin",
  admin_removeMasterKey = "removeMasterKey",
  admin_test = "test",

  routerLink_changePass = "routerLink_changePass",
  routerLink_newPass = "routerLink_newPass"
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @ViewChild('navBar') private navBar: ElementRef;
  @ViewChild(LoginComponent) loginComponent: LoginComponent;
  @ViewChild(ComboBoxComponent) comboInput: ComboBoxComponent;
  @Output() private onToggle = new EventEmitter();
  @Output() private routerNavigate = new EventEmitter();
  @Output() private onRefresh = new EventEmitter();
  @Output() private loading = new EventEmitter<boolean>();
  @Output() private sendMessage = new EventEmitter<string>();
  @Output() private searchSignal = new EventEmitter<string>();
  @Output() private actionSignal = new EventEmitter<ActionSignal>();
  @Input() private actionsQuery: ActionsQuery;
  
  collapsed = true;
  activeId = 0;
  lockDropDownOpen: boolean = true;
  pageCode: string = "";
  menu: Menu = new Menu();
  webPassDropDown: DropDown;
  notesDropDown: DropDown;
  categoryDropDown: DropDown;
  userDropDown: DropDown;
  category: Category[];
  catDataAll: RouterLink = new RouterLink(MenuItemTag.webPass_all, "/list/0", "All", 0, true);
  
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private messageBox: MessageBoxService,
    private categoryService: CategoryService) {
      this.menuPopulate();
     }

  setNavbarStyleNotLogged() {
    this.navBar.nativeElement.className = 'navbar navbar-expand navbar-dark bg-dark fixed-top'
  }

  setNavbarStyleLogged() {
    this.navBar.nativeElement.className = 'navbar navbar-expand-xl navbar-dark bg-dark fixed-top'
  }

  async onGpassLabel() {
    const me = await this.userService.getUserInfo();
    const user = new User();
    user.name = me['name'];
    user.email = me['email'];
    user.isAdmin = me['isAdmin'];
    this.messageBox.about(user);
  }

  onNavbarToggle() {
    this.collapsed = !this.collapsed;
    const initialHeight = this.navBar.nativeElement.offsetHeight;
    setTimeout(() => {
      const finalHeight = this.navBar.nativeElement.offsetHeight;
      const deltaPx = finalHeight - initialHeight;
      const margin = 5;
      if (deltaPx > 0) {
        this.onToggle.emit(deltaPx + margin);
      } else {
        this.onToggle.emit(margin);
      }
    }, 50);
  }

  tabChange(changeEvent: NgbNavChangeEvent) {
    this.lockDropDownOpen = true;
    if (changeEvent.nextId === this.webPassDropDown.index) {
      if (!(this.pageCode == PageCodes.webPassPage)) {
        this.routerNavigate.emit('/list/0');
      }
    }
    if (changeEvent.nextId === this.notesDropDown.index) {
      if (!(this.pageCode == PageCodes.notesPage)) {
        this.routerNavigate.emit('/notes');
      }
    }
    if (changeEvent.nextId === this.categoryDropDown.index) {
      if (!(this.pageCode == PageCodes.categoryPage)) {
        this.routerNavigate.emit('/category');
      }
    }
    if (changeEvent.nextId === this.userDropDown.index) {
      if (!(this.pageCode == PageCodes.usersPage)) {
        this.routerNavigate.emit('/users');
      }
    }
  }

  async afterRefresh(pageCode, event: NavigationEnd) {
    this.pageCode = pageCode;
    switch (pageCode) {
      case PageCodes.webPassPage:
        await this.webPassDropDownUpdate()
        for (let item of this.webPassDropDown.getItems()) {
          if (item instanceof RouterLink) {
            if ((item.link === event.url) || ((event.url === '/') && (item.label == "All"))) {
              item.activated = true;
            } else {
              item.activated = false;
            }
          }
        }
        break;
      case PageCodes.categoryPage:
        this.categoryDropDownUpdate();
        break;
      case PageCodes.notesPage:
        this.notesDropDownUpdate();
        break;
      case PageCodes.usersPage:
        break;

      default:

        break;
    }
  }

  async webPassDropDownUpdate(): Promise<void> {
    try {
      const data: Array<Category> = await this.categoryService.getFromUserCategory();
      this.category = data;
      this.webPassDropDown.clear();
      this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_new, label: "New", onClick: this.onNew, state: this.actionsQuery.getNewActionStateFn.call(this.actionsQuery.parent) }));
      this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_deleteAll, label: "delete all", onClick: this.deleteAll, state: this.actionsQuery.getDeleteAllStateFn.call(this.actionsQuery.parent) }));
      this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_plusOneYearAll, label: "+1 Yr. all", onClick: this.plusOneYearAll, state: this.actionsQuery.getPlustOneYearAllStateFn.call(this.actionsQuery.parent) }));
      this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_export, label: "Export", onClick: this.onExport, state: this.actionsQuery.getExportActionStateFn.call(this.actionsQuery.parent) }));
      this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_import, label: "Import", onClick: this.onImport, state: this.actionsQuery.getImportActionStateFn.call(this.actionsQuery.parent) }));
      this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_logOut, label: "Logout", onClick: this.logOut }));
      this.webPassDropDown.addItem(new Divider(MenuItemTag.webPass_divider1));
      this.webPassDropDown.addItem(this.catDataAll);
      if (this.category) {
        this.category.forEach(cat => {
          let newCatList = new RouterLink('webPass_' + cat.name, '/list/' + cat._id, cat.name, 0, false);
          this.webPassDropDown.addItem(newCatList);
        });
      }

    } catch (error) {
      throw (error);
    }
  }

  categoryDropDownUpdate(): void {
    this.categoryDropDown.clear();
    this.categoryDropDown.addItem(new Action({ tag: MenuItemTag.category_new, label: "New", onClick: this.onNew, state: this.actionsQuery.getNewActionStateFn.call(this.actionsQuery.parent) }));
  }

  notesDropDownUpdate(): void {
    this.notesDropDown.clear();
    this.notesDropDown.addItem(new Action({ tag: MenuItemTag.notes_new, label: "New", onClick: this.onNew, state: this.actionsQuery.getNewActionStateFn.call(this.actionsQuery.parent) }));
  }

  async dropDownUpdate() {
    this.categoryDropDownUpdate();
    this.notesDropDownUpdate();
    await this.webPassDropDownUpdate();
  }

  menuPopulate() {
    let dropDown: DropDown;

    dropDown = new DropDown(MenuItemTag.webPass, "WebPass");
    this.menu.push(dropDown);
    this.webPassDropDown = dropDown;

    dropDown = new DropDown(MenuItemTag.notes, "Notes");
    this.menu.push(dropDown);
    this.notesDropDown = dropDown;

    dropDown = new DropDown(MenuItemTag.category, "Category");
    this.menu.push(dropDown);
    this.categoryDropDown = dropDown;

    dropDown = new DropDown(MenuItemTag.users, "Users", 1);
    dropDown.addItem(new Action({ tag: MenuItemTag.users_new, label: "New", onClick: this.onNew }));
    this.menu.push(dropDown);
    this.userDropDown = dropDown;

    dropDown = new DropDown(MenuItemTag.admin, "Admin", 1);
    dropDown.addItem(new Action({ tag: MenuItemTag.admin_test, label: "Test", onClick: this.test }));
    this.menu.push(dropDown);

    let routerLink: RouterLink;

    routerLink = new RouterLink(MenuItemTag.routerLink_changePass, '/changePass', "Change password");
    this.menu.push(routerLink);

    routerLink = new RouterLink(MenuItemTag.routerLink_newPass, '/newPass', "New password");
    this.menu.push(routerLink);
  }
  
  onSearch() {
    this.searchSignal.emit(this.comboInput.textToSort);
  }

  clearSearch() {
    this.comboInput.clearInput();
    this.searchSignal.emit('');
  }

  onNew()          { this.actionSignal.emit(ActionSignal.onNewSignal)          }
  deleteAll()      { this.actionSignal.emit(ActionSignal.deleteAllSignal)      }
  plusOneYearAll() { this.actionSignal.emit(ActionSignal.plusOneYearAllSignal) }
  onExport()       { this.actionSignal.emit(ActionSignal.onExportSignal)       }
  onImport()       { this.actionSignal.emit(ActionSignal.onImportSignal)       }
  logOut()         { this.actionSignal.emit(ActionSignal.logOutSignal)         }
  test()           { this.actionSignal.emit(ActionSignal.testSignal)           }

  isLoggedState() {
    return this.loginService.logged;
  }

  async userLoggedNow() {
    try {
      this.setNavbarStyleLogged();
      this.onRefresh.emit();
      await this.dropDownUpdate();
    } catch (error) {
      console.log(error);
    }
  }

  userAlreadyLogged() {
    setTimeout(async () => {
      this.onRefresh.emit();
      try {
        await this.dropDownUpdate();
      } catch (error) {
        console.log(error);
        return;
      }
      this.setNavbarStyleLogged();
    }, 100);
  }

  onLoading(state) {
    this.loading.emit(state)
  }

  printErrorMessage(txt: string) {
    this.sendMessage.emit(txt);
  }

}
