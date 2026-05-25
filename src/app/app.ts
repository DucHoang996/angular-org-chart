import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrgChart } from './org-chart/org-chart'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OrgChart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('org-chart');
}
