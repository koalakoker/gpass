import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAnswers } from '../modalAnswers';

@Component({
  selector: 'app-note-edit-modal',
  templateUrl: './note-edit-modal.component.html',
  styleUrls: ['./note-edit-modal.component.css']
})
export class NoteEditModalComponent implements OnInit {

  title: string;
  content: string;
  textAreaWidth: number;
  textAreaStyleWidth: number;
  textAreaStyleMarginLeft: number;
  @ViewChild('textArea') textArea: ElementRef;
  @ViewChild('textAreaContent') textAreaContent: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    setTimeout(() => {
      this.textAreaWidth = this.textArea.nativeElement.offsetWidth;
      this.textAreaColUpdate();
      this.titleInput.nativeElement.blur();
    }, 10);
  }

  textAreaColUpdate() {
    this.textAreaStyleWidth = this.textAreaWidth - 30;
    this.textAreaStyleMarginLeft = 0;
  }

  onResize(event) {
    if (this.textArea.nativeElement.offsetWidth != this.textAreaWidth) {
      this.textAreaWidth = this.textArea.nativeElement.offsetWidth;
      this.textAreaColUpdate(); 
    }
  }

  onCloseEdit() {
    this.activeModal.close(ModalAnswers.esc);
  }
}
