import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { WebPass } from '../../modules/webpass';
import { WebPassListComponent } from '../../web-pass-list/web-pass-list.component'
import { Category } from '../../modules/category';
import { RelWebCat } from '../../modules/relwebcat';

import { WebService } from '../../services/web.service';
import { LoginService } from '../../services/login.service';

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
    private webService: WebService,
    private loginService: LoginService) {
   }

  onCloseEdit(){
    this.activeModal.close("");
  }

  save() {
    const webPass = new WebPass(this.webpass);
    webPass.crypt(this.loginService.userPassword);
    this.webService.updateWebPass(webPass)
      .then(() => {
        //console.log("Database updated");
      }, err => console.log(err));
  }

  onButtonCategory() {
    this.showCategory = !this.showCategory;
    if (this.showCategory) {
      this.selectedWebPassCatChecked = [];
      
      this.webService.get('webcatrel')
        .then((json: JSON) => {
          var allRelWebCat: Array<RelWebCat> = [];
          for (var i in json) {
            let elem: RelWebCat = Object.assign(new RelWebCat(), json[i]);
            allRelWebCat.push(elem);
          }
          this.webpassList.category.forEach((cat) => {
            var found: boolean = false;
            allRelWebCat.forEach((rel) => {
              if ((rel.id_web == this.webpass.id) &&
                (rel.id_cat == cat.id) &&
                (rel.enabled == 1)) {
                found = true;
              }
            });
            this.selectedWebPassCatChecked.push(found);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  relExist(catIndex: number, foundCbk: (index: number) => void, notFoundCbk: () => void) {
    var found: Boolean = false;
    this.webpassList.relWebCat.forEach((rel, index) => {
      if ((rel.id_web == this.webpass.id) &&
        (rel.id_cat == this.webpassList.category[catIndex].id)) {
        found = true;
        foundCbk(index);
      }
    });
    if (!found) {
      notFoundCbk();
    }
  }

  saveRel(rel: RelWebCat) {
    this.webService.updateRelWebCat(rel)
      .then(() => {
        //console.log("Database updated");
      })
      .catch(err => console.log(err));
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
          newRel.id_web = this.webpass.id;
          newRel.id_cat = this.webpassList.category[catIndex].id;
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

  newRel(rel: RelWebCat) {
    this.webService.createRelWebCat(rel)
      .then((json: JSON) => {
        var id: number;
        rel.id = id;
        //console.log("Database updated");
      })
      .catch(err => console.log(err));
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