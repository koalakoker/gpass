import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {

  old_chipher_password        = '';
  new_chipher_password        = '';
  repeat_new_chipher_password = '';
  valid = false;
  message = '';
  interval: NodeJS.Timer;

  constructor() { }

  ngOnInit() {
  }

  onChangePass() {
    this.sendMessage('New <mark><i>master password</i></mark> has been updated', 3000);
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
