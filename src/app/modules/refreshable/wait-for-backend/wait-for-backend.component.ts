import { Component, Output, EventEmitter} from '@angular/core';
import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';
import * as InputCodes from '../inputCodes';
import { UserService } from 'src/app/services/api/user.service';

@Component({
  selector: 'app-wait-for-backend',
  templateUrl: './wait-for-backend.component.html'
})
export class WaitForBackendComponent implements Refreshable {

  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();
  checkDuration_ms: number = 2000; 

  constructor(private userService: UserService) { }

  async refresh(cmd: string): Promise<RefreshReturnData> {
    var ret: RefreshReturnData = new RefreshReturnData(PageCodes.waitForBackend);
    ret.childInject = ReturnCodes.None;
    switch (cmd) {
      case InputCodes.Refresh:
        try {
          const backendAvailable = await this.checkForBackend();
          if (backendAvailable) {
            ret.childInject = ReturnCodes.BackendReady;
            return ret;
          } else {
            throw ("Backend not ready");
          }
        } catch(error) {
          throw (error);
        }
        break;
    
      default:
        break;
    }
    return ret;
  }
  
  queryForAction(string: any): boolean {
    throw new Error('Method not implemented.');
  }

  async checkForBackend(): Promise<boolean> {
    try {
      const me = await this.userService.getUserInfo();
      this.hasChanged.emit(PageCodes.waitForBackend);
      return true;
    } catch (error) {
      setTimeout(this.checkForBackend.bind(this), this.checkDuration_ms);
      return false;
    }
  }

}
