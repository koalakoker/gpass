import { Injectable } from '@angular/core';
import { ModalAnswers } from '../bootstrap/modal/modalAnswers';
import { GCrypto } from '../modules/gcrypto';
import { MessageBoxService } from './message-box.service';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private messageBoxService: MessageBoxService) { }

  upload() {
    return new Promise<any>((resolve, reject) => {
      try {
        var input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.addEventListener('change', (event) => {
          var reader = new FileReader();
          reader.onload = async () => {
            const { ans, password } = await this.messageBoxService.password('Insert password', 'Insert password to cripy the exported data');
            if (ans === ModalAnswers.confirm) {
              const decrypted = GCrypto.decrypt(reader.result.toString(), password);
              let obj;
              try {
                obj = JSON.parse(decrypted);
                resolve(obj);
              } catch (error) {
                reject('Error decoding. Wrong password or file');
              }
            }
            reject('password input cancelled');
          };
          reader.readAsText(input.files[0]);
        });
      } catch (error) {
        console.log(error);
        reject('error selecting file');
      }
    })
  }

  async onImport(): Promise<any> {
    let json: any;
    try {
      json = await this.upload();
      return json;
    } catch (error) {
      throw (error);
    }
  }
}
