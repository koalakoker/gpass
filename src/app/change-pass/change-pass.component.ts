import { Refreshable } from './../modules/refreshable';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebPassService } from '../services/web-pass.service';
import { WebPass } from '../modules/webpass';
import { Observable } from '../../../node_modules/rxjs';
import { GCrypto } from '../modules/gcrypto';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit, Refreshable {

  old_chipher_password        = '';
  new_chipher_password        = '';
  repeat_new_chipher_password = '';
  valid = false;
  message = '';
  interval;
  itemToBeSentNbr = 0;
  serverAccess = '';

  @ViewChild('buttonChange') buttonChange: ElementRef;

  constructor(private configService: WebPassService) { }

  ngOnInit() {
  }

  refresh() {
    return "";
  }

  onChangePass() {

    // Get the DB values and decrypt with old pass
    this.configService.get(this.old_chipher_password).subscribe(
      (data: Array<WebPass>) => {
        // Decode and create a new WebPass list
        const list: WebPass[] = data.map((x) => {
          const w = new WebPass(x);
          w.decrypt(this.old_chipher_password);  
          return w;
        }, this);
        
        // Cript the values of the DB with the new pass
        this.itemToBeSentNbr = list.length;
        list.forEach(webPass => {
          const newWebPass = new WebPass(webPass);
          webPass.crypt(this.new_chipher_password);
          
          const ob: Observable<any> = this.configService.update(webPass, this.old_chipher_password);
          ob.subscribe( 
            () => {
              this.itemToBeSentNbr--;
              if (this.itemToBeSentNbr === 0)
              {
                // Calculate the new access file for the db
                this.configService.callChipher(this.old_chipher_password).subscribe(
                  (data) => {
                    const key: string = GCrypto.hash(this.new_chipher_password);
                    this.serverAccess = 'New <mark><i>master password</i></mark> has been updated. Please update the <mark><i>passDB_cript.php</i></mark> file with the following values:\n\n';
                    this.serverAccess += '$Password = "' + key + '";\n';
                    this.serverAccess += '$Server = "'   + GCrypto.cryptDBAccess(data['server']  , key) + '";\n';
                    this.serverAccess += '$Username = "' + GCrypto.cryptDBAccess(data['username'], key) + '";\n';
                    this.serverAccess += '$PW = "'       + GCrypto.cryptDBAccess(data['password'], key) + '";\n';
                    this.serverAccess += '$DB = "'       + GCrypto.cryptDBAccess(data['database'], key) + '";\n';
                })
              }   
                
            }
          );

        }, this);

      },
      err => {
        this.sendMessage('The <mark><i>old master password is not correct</i></mark>', 3000);
      }
    );



  }

  validate() {
    /* Valid condition */
    if ((this.old_chipher_password       !=='') && 
        (this.new_chipher_password       !=='') &&
        (this.repeat_new_chipher_password!=='') &&
        (this.new_chipher_password === this.repeat_new_chipher_password) &&
        (this.new_chipher_password !== this.old_chipher_password)
       ) {
      this.valid = true;
      setTimeout(() => {
        this.buttonChange.nativeElement.focus();
      }, 100, this);
    }

    let message = '';
    let time = 0;
    const delta = 3000;

    /* old no null */
    if (this.old_chipher_password === '')
    {
      message += 'The <mark><i>"old master password"</mark></i> can\'t be empty\n';
      time += delta;
    }

    /* new no null */
    if (this.new_chipher_password === '')
    {
      message += 'The <mark><i>"new master password"</mark></i> can\'t be empty\n';
      time += delta;
    }

    /* Repeat not equal to new */
    if (this.repeat_new_chipher_password !== this.new_chipher_password)
    {
      message += 'The <mark><i>"retyped new master pasmarkword"</mark></i> must be the same of the <mark><i>"new master password"</mark></i>\n';
      time += delta;
    }

    /* New pass must be different from old */
    if (this.new_chipher_password === this.old_chipher_password)
    {
      message += 'The <mark><i>"new master password"</mark></i> must be different from the <mark><i>"old master password"</mark></i>\n';
      time += delta;
    }

    this.sendMessage(message, time);

  }

  sendMessage(text: string, time: number) {
    clearInterval(this.interval);
    this.message = text;
    this.interval = setInterval(() => {
      this.message = '';
      clearInterval(this.interval);
    }, time);
  }

}
