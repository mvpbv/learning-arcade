import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getScores(mode: string): number[] {
    const scores = localStorage.getItem(mode);
    if (scores) {
      return JSON.parse(scores)
    }
    return []
  }
  saveScores(mode: string, scores: number[]) {
    localStorage.setItem(mode, JSON.stringify(scores));
  }
}
