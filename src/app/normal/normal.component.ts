import {Component, OnInit} from '@angular/core';
import {interval, map, Subscription, takeWhile, tap, timer} from 'rxjs';
import {AsyncPipe, NgStyle} from '@angular/common';
import {GameService} from '../game.service';


@Component({
  selector: 'app-normal',
  imports: [
    NgStyle,
    AsyncPipe,
  ],
  templateUrl: './normal.component.html',
  styleUrl: './normal.component.css'
})

export class NormalComponent implements OnInit {
  matrix: boolean[][] = [];
  correct: number[] = [0, 0];
  score: number = 0;
  lives: boolean[] = [true, true, true];
  timerSubscription: Subscription | null = null;
  message: string = "Click any box to start!";
  gameStarted: boolean = false;
  gameState : string = "";
  scores : number[] = [];
  dimensions: number[] = [4,4];
  clickedCell: number[] = [-1, -1];
  boardStyles : Record<string, string> = {}
  level : number = 1;
  levelMap :{ [key: number]: number } = {};

  constructor(private gameService : GameService) {
    this.levelMap = gameService.levelMap;
  }
  setBoardStyles() {
    this.boardStyles = {
      'display': 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'background' :'#18254d',
      'box-shadow': this.gameState === 'correct' ? 'rgba(24, 79, 28, 0.8) 0 0 20px' : 'rgba(222, 19, 52, 0.8) 0 0 20px',
      'animation' : this.gameState === 'correct' || this.gameState === 'incorrect' ? 'shake 1s' : 'none',
    }
  }

  ngOnInit() {
    this.matrix = this.gameService.resizeMatrix(this.dimensions, this.correct);
  }

  newGame() {
    this.score = 0;
    this.gameState = "";
    this.message = "";
    this.gameStarted = true;
    this.level = 1;
    this.dimensions = [4,4];
    this.lives = [true, true, true];
    this.newRound();
  }
  endGame() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.gameState = "loss";
    this.gameStarted = false;
    this.scores.push(this.score);
    this.message = `You're cooked! You scored ${this.score} points!`;
    this.matrix = this.gameService.resizeMatrix(this.dimensions, this.correct);
  }
  newRound() {
    this.gameState = "";
    this.matrix = this.gameService.resizeMatrix(this.dimensions, this.correct);
    this.startTimer();
  }
  increaseDifficulty() {
    this.dimensions[0]++;
    this.dimensions[1]++;
    this.level++;
    this.message = `Level up! You're now on level ${this.level}!`;
    this.newRound();
  }
  startTimer() {
    this.gameService.startTimer(() => this.lose());
  }
  stopTimer() {
    this.gameService.stopTimer();
  }
  get timeFmt() {
    return this.gameService.timer$.pipe(
      map(timer => timer.toString().padStart(2, '0'))
    );
  }

  checkCell(i: number, j: number) {
    if (!this.gameStarted) {
      this.newGame();
      this.gameStarted = true;
      return;
    }
    if (this.timerSubscription) {
      this.stopTimer();
    }
    this.clickedCell = [i, j];

    if (this.matrix[i][j]) {
      this.win();
    } else {
      this.lose();
    }
  }

  lose() {
    this.gameState = "incorrect";
    this.setBoardStyles();
    timer(1000).pipe(
      tap(() => {
      })
    ).subscribe();
    this.lives.pop();
    this.lives.unshift(false);
    if (this.lives.every(l => !l)) {
      this.endGame();
    } else {
      this.newRound();
    }
  }

  win() {
    this.gameState = "correct";
    this.setBoardStyles();
    timer(1000).pipe(
      tap(() => {
      })
    ).subscribe();
    this.score++;
    if (this.score > this.levelMap[this.level]) {
      this.increaseDifficulty();
    } else {
      this.newRound();
    }
  }
}
