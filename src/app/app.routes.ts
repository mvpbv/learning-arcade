import { Routes } from '@angular/router';
import {NormalComponent} from './normal/normal.component';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'normal', component: NormalComponent},
  {path: 'home', component: HomeComponent}
];
