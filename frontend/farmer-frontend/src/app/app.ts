import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,      // CHANGED: was templateUrl and styleUrl
  // REMOVED: styleUrl line
})
export class App {
  title = 'farmer-frontend';    //new line
}
