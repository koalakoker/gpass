import { Component} from '@angular/core';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css']
})
export class PopupMessageComponent {

  message: string = '';
  success: boolean = true;

  sendMessage(text: string, time: number) {
    this.message = text;
    setTimeout(() => {
      this.message = '';
    }, time);
  }

}
