import { Component, OnInit } from '@angular/core';
import { ConfigService, Config } from './config.service';
import { HttpResponse } from '../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.showConfig();
  }

  config: Config;
  headers;
  keys: string[];

  showConfig() {
    this.configService.getConfig().subscribe((data: Config) => this.config = {
      heroesUrl: data['heroesUrl'],
      textfile: data['textfile']
    })
  }

  showConfigResponse() {
    this.configService.getConfigResponse().subscribe((resp: HttpResponse<Config>) => {
      this.keys = resp.headers.keys();
      this.headers = this.keys.map(key => {key: resp.headers.get(key);});
      this.config = {
        ... resp.body
      };
    })
  }

}
