import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';
import * as InputCodes from '../inputCodes';
import { Note } from '../../note';
import { LoginService } from 'src/app/services/api/login.service';
import { NoteService } from 'src/app/services/api/note.service';
import * as _ from 'lodash-es';
import { MessageBoxService } from 'src/app/services/message-box.service';
import { ModalAnswers } from 'src/app/bootstrap/modal/modalAnswers';
import { NoteEditModalComponent } from 'src/app/bootstrap/modal/note-edit-modal/note-edit-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Resizable } from '../resizable';
import { ResizeService } from 'src/app/services/resize.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent 
extends Resizable
implements OnInit, Refreshable {
  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();
  notesList: Note[] = [];
  selectedNote: Note;
  errorMessage: string = '';

  constructor(private loginService: LoginService,
              private apiService: NoteService,
              private messageBoxService: MessageBoxService,
              private modalService: NgbModal,
              private resizeService: ResizeService) {
    super(resizeService);
  }

  ngOnInit(): void {
    this.styleUpdate(this.resizeService.lastSize);
  }

  async refresh(cmd: string): Promise<RefreshReturnData> {
    var ret: RefreshReturnData = new RefreshReturnData;
    ret.pageCode = PageCodes.notesPage;
    
    if (cmd == InputCodes.Refresh) {
      if (this.loginService.checklogged()) {
        try {
          await this.getList();
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
    } else if (cmd == InputCodes.NewBtnPress) {
      this.onNew();
      ret.childInject = ReturnCodes.None;
      return (ret);
    }
    return ret;
  }

  queryForAction(action: string): boolean {
    if (action === InputCodes.NewBtnPress) {
      return (this.isNewPossible())
    }
  }

  afterLoad(listRaw: Array<Note>) {
    // // Select only by cat (0 = all)
    // if ((this.catID !== '0') && (this.catID !== undefined)) {
    //   this.relWebCat = this.relWebCat.filter((x) => {
    //     return ((x.id_cat == this.catID) && (x.enabled == 1));
    //   });
    //   var filtWebId: string[] = [];
    //   this.relWebCat.forEach((rel) => {
    //     filtWebId.push(rel.id_web);
    //   });
    //   webPassListRaw = webPassListRaw.filter((web) => {
    //     return this.include(filtWebId, web._id);
    //   });
    // } else {
    //   if ((this.searchStr !== '') && (this.searchStr !== undefined)) {
    //     webPassListRaw = webPassListRaw.filter((web) => {
    //       return (web.name.toLocaleLowerCase().includes(this.searchStr.toLocaleLowerCase()));
    //     });
    //   }
    // }
    this.notesList = listRaw;
  }

  async getList() {
    try {
      const listRaw = _.cloneDeep(await this.apiService.getList());
      this.afterLoad(listRaw);
    } catch (error) {
      console.log(error);
      throw new Error("Back end not reachable");
    }
  }

  async onNew() {
    if (this.isNewPossible()) {
      const note = new Note();
      try {
        note._id = await this.apiService.create(note);
        this.notesList.unshift(note);
        this.hasChanged.emit(PageCodes.notesPage);
      } catch (error) {
        console.log(error);
      }
    }
  }

  onSelect(note: Note) {
    if (this.selectedNote != note) {
    }
    this.selectedNote = note;
  }

  isSelected(note: Note): boolean {
    return (note === this.selectedNote);
  }

  isActive(note: Note): string {
    return (this.isSelected(note) ? "active" : "");
  }

  async editNoteModal(note: Note) {
    const modalRef = this.modalService.open(NoteEditModalComponent, { scrollable: true, size: 'xl', keyboard: false });
    modalRef.componentInstance.title = note.title;
    modalRef.componentInstance.note = note;
    try {
      await modalRef.result;
    } catch (error) {}
  }

  async onEdit(i: number) {
    await this.editNoteModal(this.notesList[i]);
    this.onCloseEdit();
  }

  onCloseEdit() {
    // if (this.needReenter) {
    //   if (this.catID != '0') {
    //     this.getWebPassList();
    //   }
    //   this.needReenter = false;
    // }
  }

  async onButtonDelete(i: number) {
    const ans = await this.messageBoxService.question("Warning", "Are you sure to delete this?");
    if (ans == ModalAnswers.yes) {
      this.delete(i);
    }
  }

  async delete(i: number) {
    const note = this.notesList[i];
    try {
      await this.apiService.delete(note._id);
      this.notesList.splice(i, 1);
      this.hasChanged.emit(PageCodes.notesPage);
    } catch (error) {
      console.log(error);
    }
  }

  isNewPossible(): boolean {
    return (this.loginService.getUserKey() !== "");
  }

}
