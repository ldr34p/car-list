import { Component, signal } from '@angular/core';
import { CarListComponent } from './car-list/car-list';

@Component({
  selector: 'app-root',
  imports: [CarListComponent],
  template: '<app-car-list></app-car-list>',
  styleUrl: './car-list/car-list.css',
})
export class App {
  protected readonly title = signal('car-list');
}
