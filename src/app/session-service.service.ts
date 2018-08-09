import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) { }

  setKey(key: string, value: string) {
    this.storage.set(key, value);
  }

  getKey(key: string): string {
    return this.storage.get(key);
  }
}
