import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureGraphComponent } from './components/temperature-graph/temperature-graph.component';
import { HumidityGraphComponent } from './components/humidity-graph/humidity-graph.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsComponent } from './components/stats/stats.component';
import { PowerCostsGraphComponent } from './components/power-costs-graph/power-costs-graph.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TemperatureGraphComponent,
    HumidityGraphComponent,
    PowerCostsGraphComponent,
    StatsComponent,
    MatGridListModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
