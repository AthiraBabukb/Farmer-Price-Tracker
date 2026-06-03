import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';     // NEW LINE
import { Login } from './pages/login/login';           // NEW LINE
import { Register } from './pages/register/register';  // NEW LINE
import { Dashboard } from './pages/dashboard/dashboard'; // NEW LINE
import { Search } from './pages/search/search';        // NEW LINE
import { Compare } from './pages/compare/compare';     // NEW LINE
import { Alerts } from './pages/alerts/alerts';        // NEW LINE
import { Profile } from './pages/profile/profile';     // NEW LINE

export const routes: Routes = [
    { path: '', component: Landing },           // NEW LINE
  { path: 'login', component: Login },        // NEW LINE
  { path: 'register', component: Register },  // NEW LINE
  { path: 'dashboard', component: Dashboard },// NEW LINE
  { path: 'search', component: Search },      // NEW LINE
  { path: 'compare', component: Compare },    // NEW LINE
  { path: 'alerts', component: Alerts },      // NEW LINE
  { path: 'profile', component: Profile },    // NEW LINE
  { path: '**', redirectTo: '' }              // NEW LINE
];
