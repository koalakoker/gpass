import { Injectable } from '@angular/core';
import { ModalAnswers } from '../bootstrap/modal/modalAnswers';
import { GCrypto } from '../modules/gcrypto';
import { UserService } from './api/user.service';
import { MessageBoxService } from './message-box.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(
    private messageBoxService: MessageBoxService,
    private userService: UserService) {}

  download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  getDateTime(): string {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + '_' + time;
    return dateTime;
  }

  async onExport(content: any) {
    const { ans, password } = await this.messageBoxService.password('Insert password', 'Insert password to cripy the exported data');
    if (ans === ModalAnswers.confirm) {
      const me = await this.userService.getUserInfo();
      const fileName = me.name + '_' + this.getDateTime() + '_export.pass';
      const crypted = GCrypto.crypt(JSON.stringify(content), password);
      this.download(crypted, fileName, 'text/plain');
    }
  }
}
