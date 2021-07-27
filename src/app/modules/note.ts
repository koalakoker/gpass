import { GCrypto } from "./gcrypto";

export class Note {

  _id    : string;
  title  : string;
  content: string;

  constructor(note?: Note) {
    if (note == null) {
      this._id = '';
      this.title = 'New note';
      this.content = '';
    }
    else {
      this._id = note._id;
      this.title = note.title;
      this.content = note.content;
    }
  }

  crypt(key: string) {
    this.title = GCrypto.crypt(this.title, key);
    this.content = GCrypto.crypt(this.content, key);
  }

  decrypt(key: string) {
    this.title = GCrypto.decrypt(this.title, key);
    this.content = GCrypto.decrypt(this.content, key);
  }

}