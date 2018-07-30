import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'gpass';
  opt = true;
  ngOnInit() {
  }

  items: any[] = [
    { title: 'Item 1' },
    { title: 'Item 2' },
    { title: 'Item 3' }
  ];

  @ViewChild('hello') helloTemplate;

  ngAfterViewInit() {
    console.log(this.helloTemplate);
  }
}
