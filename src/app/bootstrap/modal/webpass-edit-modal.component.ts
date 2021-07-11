import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { WebPass } from '../../modules/webpass';
import { WebPassListComponent } from '../../modules/refreshable/web-pass-list/web-pass-list.component'
import { Category } from '../../modules/category';
import { RelWebCat } from '../../modules/relwebcat';

import { LoginService } from '../../services/login.service';
import { WebLinkService } from 'src/app/services/web-link.service';
import { RelWebCatService } from 'src/app/services/rel-web-cat.service';

@Component({
  selector:    'webpass-edit-modal',
  templateUrl: './webpass-edit-modal.component.html'
})
export class WebPassEditModalComponent {
  @Input() webpass: WebPass;
  @Input() category: Category[];
  @Input() webpassList: WebPassListComponent;
  @Input() title: string;

  selectedWebPassCatChecked: boolean[];
  passwordType: string = "password";
  showCategory: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private webLinkService: WebLinkService,
    private relWebCatService: RelWebCatService,
    private loginService: LoginService) {
   }

  onCloseEdit(){
    this.activeModal.close("");
  }

  async save() {
    const webPass = new WebPass(this.webpass);
    webPass.crypt(this.loginService.getUserKey());
    try {
      await this.webLinkService.updateWebPass(webPass._id, webPass);
      console.log("Database updated");
    } catch (error) {
      console.log(error);
    }
  }

  async onButtonCategory() {
    this.showCategory = !this.showCategory;
    if (this.showCategory) {
      this.selectedWebPassCatChecked = [];
      
      try {
        const allRelWebCat = await this.relWebCatService.getWebCatRel();  
        this.webpassList.category.forEach((cat) => {
          var found: boolean = false;
          allRelWebCat.forEach((rel) => {
            if ((rel.id_web == this.webpass._id) &&
              (rel.id_cat == cat._id) &&
              (rel.enabled == 1)) {
              found = true;
            }
          });
          this.selectedWebPassCatChecked.push(found);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  relExist(catIndex: number, foundCbk: (index: number) => void, notFoundCbk: () => void) {
    var found: Boolean = false;
    this.webpassList.relWebCat.forEach((rel, index) => {
      if ((rel.id_web == this.webpass._id) &&
        (rel.id_cat == this.webpassList.category[catIndex]._id)) {
        found = true;
        foundCbk(index);
      }
    });
    if (!found) {
      notFoundCbk();
    }
  }

  async saveRel(rel: RelWebCat) {
    try {
      await this.relWebCatService.updateRelWebCat(rel._id, rel);  
      console.log("Database updated");
    } catch (error) {
      console.log(error);
    }
  }

  onCatCheckChange(catIndex: number) {
    if (this.selectedWebPassCatChecked[catIndex]) {
      this.relExist(catIndex,
        // Found Callback
        (index: number) => {
          this.webpassList.relWebCat[index].enabled = 1;
          this.saveRel(this.webpassList.relWebCat[index]);
        },
        // Not Found Callback
        () => {
          // Create a relation between list[webPasIndex] and category[catIndex]
          var newRel: RelWebCat = new RelWebCat();
          newRel.id_web = this.webpass._id;
          newRel.id_cat = this.webpassList.category[catIndex]._id;
          newRel.enabled = 1;
          this.webpassList.relWebCat.push(newRel);
          this.newRel(newRel);
        });
    }
    else {
      this.relExist(catIndex, (index: number) => {
        this.webpassList.relWebCat[index].enabled = 0;
        this.saveRel(this.webpassList.relWebCat[index]);
      }, () => {
      });
    }
    this.webpassList.needReenter = true;
  }

  async newRel(rel: RelWebCat) {
    try {
      const id = await this.relWebCatService.createRelWebCat(rel);  
      rel._id = id;
      console.log("Database updated");
    } catch (error) {
      console.log(error);
    }
  }

  onPlusOneYear() {
    const w: WebPass = this.webpass;
    const ed: string = w.expirationDate;
    w.plusOneYear();
    if (ed !== w.expirationDate) {
      this.save();
    }
  }

  showPass() {
    if (this.passwordType == "password") {
      this.passwordType = "text";
    } else {
      this.passwordType = "password";
    }
  }

  onTodayButton() {
    const w: WebPass = this.webpass;
    const rd: string = w.registrationDate;
    const ed: string = w.expirationDate;
    w.setToday();
    if ((rd !== w.registrationDate) || (ed !== w.expirationDate)) {
      this.save();
    }
  }
}