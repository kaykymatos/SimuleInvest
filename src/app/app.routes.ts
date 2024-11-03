import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', title:'Home', component: HomePageComponent }, 
  { path: 'about', title:'About',component: AboutComponent },
];
