import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureGraphComponent } from './components/temperature-graph/temperature-graph.component';
import { HumidityGraphComponent } from './components/humidity-graph/humidity-graph.component';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TemperatureGraphComponent,
    HumidityGraphComponent,
    MatGridListModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
