import { Injectable } from '@angular/core';
import {BehaviorSubject, interval, Subscription, takeWhile} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  levelMap = {

    1: 8,
    2: 15,
    3: 22,
    4: 30,
  }
  private timerSubject = new BehaviorSubject<number>(3);
  timerSubscription: Subscription | null = null;
  timer$ = this.timerSubject.asObservable();

  constructor() { }

  generateMatrix([x,y]: number[], correct: number[]) {
    const matrix = [];
    for (let i = 0; i < x; i++) {
      const row = [];
      for (let j = 0; j < y; j++) {
        row.push(false);
      }
      matrix.push(row);
    }
    matrix[correct[0]][correct[1]] = true;
    return matrix;
  }
  resizeMatrix([x,y]: number[], correct: number[]) {
    correct[0] = Math.random() * x | 0;
    correct[1] = Math.random() * y | 0;
    return this.generateMatrix([x,y], correct)
  }
  startTimer(callback: () => void) {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubject.next(3);
    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => this.timerSubject.value > 0)
    ).subscribe(() => {
      const currentTimer = this.timerSubject.value - 1;
      this.timerSubject.next(currentTimer);
      if (currentTimer === 0) {
        callback();
      }
    })
  }
  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }



}
