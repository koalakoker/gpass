import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  setKey(key: string, value: string) {
    this.storage.set(key, value);
  }

  getKey(key: string): string {
    return this.storage.get(key);
  }

  clearAll(): void {
    this.storage.clear();
  }
}
