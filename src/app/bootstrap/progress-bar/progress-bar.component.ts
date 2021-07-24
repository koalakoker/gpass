import { Component } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  visible: boolean = false;
  percentage: number = 0;
  private totalStep = 0;
  private step = 0;

  constructor() { }

  init(totalStep: number) {
    this.totalStep = totalStep;
    this.step = 0;
    this.percentage = 0;
    this.visible = true;
  }

  end() {
    this.visible = false;
    this.step = 0;
    this.totalStep = 0;
    this.percentage = 0;
  }

  nextStep() {
    this.step += 1;
    this.percentage = (this.step / this.totalStep) * 100;
  }

}
