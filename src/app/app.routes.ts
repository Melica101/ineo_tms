import { Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', component: TasksComponent },
  { path: 'statistics', component: StatisticsComponent },
];

