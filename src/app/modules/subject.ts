import {Observer} from "../modules/observer"

export class Subject {
  observers: Observer[] = [];

  notify(): void {
    console.log("Subject notify");
    this.observers.forEach(observer => {
      observer.update();      
    });
  }
  
  attach(observerToAdd: Observer): void {
    let index: Observer = this.observers.find((observer) => {
      return observer === observerToAdd;
    });
    if (index === undefined) {
      this.observers.push(observerToAdd);
    }
    console.log("Subject attach:");
    console.log(this);
    console.log(this.observers);
  }

  detach(observerToRemove: Observer): void {
    for (let i = 0; i < this.observers.length; i++) {
      if (this.observers[i] === observerToRemove) {
        this.observers.splice(i, 1);
      }
    }
    console.log("Subject detach:");
    console.log(this.observers);
  }

}