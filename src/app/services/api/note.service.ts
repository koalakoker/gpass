import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { Note } from '../../modules/note';
import { Api } from './api';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { LocalService } from '../local.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService extends Api {

  private apiUrl: string = this.apiBaseUrl + '/notes/';

  constructor(
    private localService: LocalService,
    private loginService: LoginService,
    private http: HttpClient
  ) {
    super();
  }

  decryptList(dataCypt: Array<Note>): Array<Note> {
    let dataDecrypt: Array<Note> = [];
    let userPassword: string = this.loginService.getUserKey();
    dataDecrypt = dataCypt.map((element: Note) => {
      const elementClone = new Note(element);
      elementClone.decrypt(userPassword);
      return elementClone;
    }, this);
    return dataDecrypt;
  }

  sortList(data: Array<Note>): Array<Note> {
    data.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      } else {
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    return data;
  }

  async getList(): Promise<Array<Note>> {
    try {
      let data = await this.http.get<Array<Note>>(this.apiUrl, this.httpOptions(this.localService)).toPromise();
      data = this.decryptList(data);
      data = this.sortList(data);
      return (data);
    } catch (error) {
      this.error("is not possible to retrieve the element list");
    }
  }

  async create(note: Note): Promise<string> {
    try {
      let userPassword: string = this.loginService.getUserKey();
      let elementClone = _.cloneDeep(note);
      elementClone.crypt(userPassword);
      const body = _.omit(elementClone, ['_id']);
      const newNote = await this.http.post<Note>(this.apiUrl, body, this.httpOptions(this.localService)).toPromise();
      return (newNote._id);
    } catch (error) {
      this.error("is not possible to create a new element");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.http.delete<Note>(this.apiUrl + '/' + id, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to delete this elemennt");
    }
  }

  async update(id: string, note: Note): Promise<Note> {
    try {
      let userPassword: string = this.loginService.getUserKey();
      let elementClone = _.cloneDeep(note);
      elementClone.crypt(userPassword);
      const body = _.omit(elementClone, ['_id']);
      return await this.http.put<Note>(this.apiUrl + '/' + id, body, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to update this element");
    }
  }
}
