import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebPass } from '../../modules/webpass';
import { Category } from '../../modules/category';
import { RelWebCat } from '../../modules/relwebcat';
import { WebService } from '../../services/web.service';

@Component({
  selector:    'webpass-edit-modal',
  templateUrl: './webpass-edit-modal.component.html'
})
export class WebPassEditModalComponent {
  @Input() webpass: WebPass;
  @Input() title: string;
  showCategory: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private webService: WebService) {
   }

  dismiss(str: string){
    this.activeModal.dismiss(str);
  }

  onCloseEdit(){
    this.activeModal.close("");
  }

  save(){
    console.log("Save change. TBI");
  }

  @Input() category: Category[];
  @Input() relWebCat: RelWebCat[];
  selectedWebPassCatChecked: boolean[];
  passwordType: string = "password";
  needReenter: boolean = false;

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
          this.category.forEach((cat) => {
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

  relExist(webPassIndex: number, catIndex: number, foundCbk: (index: number) => void, notFoundCbk: () => void) {
    var found: Boolean = false;
    this.relWebCat.forEach((rel, index) => {
      if ((rel.id_web == this.webpass.id) &&
        (rel.id_cat == this.category[catIndex].id)) {
        found = true;
        foundCbk(index);
      }
    });
    if (!found) {
      notFoundCbk();
    }
  }

  saveRel(rel: RelWebCat) {
    this.webService.updateRelWebCat(rel, "")
      .then(() => {
        console.log("Database updated");
      })
      .catch(err => console.log(err));
  }

  onCatCheckChange(webPassIndex: number, catIndex: number) {
    if (this.selectedWebPassCatChecked[catIndex]) {
      this.relExist(webPassIndex, catIndex,
        // Found Callback
        (index: number) => {
          this.relWebCat[index].enabled = 1;
          this.saveRel(this.relWebCat[index]);
        },
        // Not Found Callback
        () => {
          // Create a relation between list[webPasIndex] and category[catIndex]
          var newRel: RelWebCat = new RelWebCat();
          newRel.id_web = this.webpass.id;
          newRel.id_cat = this.category[catIndex].id;
          newRel.enabled = 1;
          this.relWebCat.push(newRel);
          this.newRel(newRel);
        });
    }
    else {
      this.relExist(webPassIndex, catIndex, (index: number) => {
        this.relWebCat[index].enabled = 0;
        this.saveRel(this.relWebCat[index]);
      }, () => {
      });
    }
    this.needReenter = true;
  }

  newRel(rel: RelWebCat) {
    this.webService.createRelWebCat(rel, "")
      .then((json: JSON) => {
        var id: number;
        rel.id = id;
        console.log("Database updated");
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