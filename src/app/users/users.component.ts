import { Component, OnInit } from '@angular/core';
import { Refreshable } from '../modules/refreshable';
import { LoginService } from '../services/login.service'

@Component({
  selector: 'app-users-component',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, Refreshable {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    
  }

  refresh(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve("");
    })
  }

}
