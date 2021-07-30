import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash-es';
import { Note } from 'src/app/modules/note';
import { NoteService } from 'src/app/services/api/note.service';
import { MessageBoxService } from 'src/app/services/message-box.service';
import { ModalAnswers } from '../modalAnswers';

@Component({
  selector: 'app-note-edit-modal',
  templateUrl: './note-edit-modal.component.html',
  styleUrls: ['./note-edit-modal.component.css']
})
export class NoteEditModalComponent implements OnInit {
  note: Note;
  noteDB: Note;
  titleWidth: number;
  textAreaWidth: number;
  textAreaStyleWidth: number;
  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('textArea') textArea: ElementRef;
  @ViewChild('textAreaContent') textAreaContent: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;

  constructor(
    private noteService: NoteService,
    private messageBox: MessageBoxService,
    private activeModal: NgbActiveModal) { }

  ngOnInit() {

    setTimeout(() => {
      this.textAreaWidth = this.textArea.nativeElement.offsetWidth;
      this.textAreaWidthUpdate();
      this.noteDB = _.cloneDeep(this.note);
      this.closeButton.nativeElement.focus();
    }, 10);
  }

  textAreaWidthUpdate() {
    this.textAreaStyleWidth = this.textAreaWidth - 30;
    this.titleWidth = this.textAreaWidth - 60;
  }

  onResize(event) {
    if (this.textArea.nativeElement.offsetWidth != this.textAreaWidth) {
      this.textAreaWidth = this.textArea.nativeElement.offsetWidth;
      this.textAreaWidthUpdate(); 
    }
  }

  async updateBackEnd() {
    if (!_.isEqual(this.note, this.noteDB)) {
      try {
        await this.noteService.update(this.note._id, this.note);
        this.noteDB = _.cloneDeep(this.note);
        console.log('Database updated');
      } catch (error) {
        await this.messageBox.message('Warning', error);
        throw (error);
      }
    }
  }

  restore() {
    if (!_.isEqual(this.note, this.noteDB)) {
      // Manual copy not clone deep to update the note in noteList
      this.note.title = this.noteDB.title;
      this.note.content = this.noteDB.content;
    }
  }

  blurOngoing: boolean = false;

  async onBlur() {
    this.blurOngoing = true;
    try {
      await this.updateBackEnd();
      this.blurOngoing = false; 
    } catch (error) {
      console.log(error);
      this.restore();
      this.blurOngoing = false;
    }
  }

  async onClose() {
    if (!this.blurOngoing) {
      try {
        await this.updateBackEnd();
      } catch (error) {
        console.log(error);
        this.restore();
      }
    }
    this.activeModal.close(ModalAnswers.esc);
  }
}
