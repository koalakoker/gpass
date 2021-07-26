import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';
import * as InputCodes from '../inputCodes';
import { Note } from '../../note';
import { LoginService } from 'src/app/services/api/login.service';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit, Refreshable {

  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();
  notesList: Note[] = [];
  errorMessage: string = '';

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
  }

  async refresh(cmd: string): Promise<RefreshReturnData> {
    var ret: RefreshReturnData = new RefreshReturnData;
    ret.pageCode = PageCodes.notesPage;
    
    if (cmd == InputCodes.Refresh) {
      if (this.loginService.checklogged()) {
        try {
          await this.getNotesList();
          ret.childInject = ReturnCodes.ButtonInsertWebPass;
          return (ret);
        } catch (error) {
          this.notesList = [];
          throw (error);
        }
      } else {
        this.notesList = [];
        throw ("web-pass-list(refresh)->User not logged");
      }
    }
    return ret;
  }

  queryForAction(action: string): boolean {
    return true;
  }

  async getNotesList() {
    return []; // TBI
  }

}
