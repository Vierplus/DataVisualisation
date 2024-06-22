import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Router, NavigationStart } from '@angular/router';

interface ChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-temperature-graph',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './temperature-graph.component.html',
  styleUrls: ['./temperature-graph.component.scss'],
})
export class TemperatureGraphComponent implements OnInit {
  public multi: ChartData[] = [{ name: 'Temperature', series: [] }];
  public view: [number, number] = [700, 400];

  public showLegend = true;
  public showLabels = true;
  public animations = true;
  public xAxis = true;
  public yAxis = true;
  public showYAxisLabel = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Time';
  public yAxisLabel = 'Temperature';
  public timeline = true;

  public colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ff0000', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  public gradient = false;

  constructor(private mqttService: MqttService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the MQTT service to receive data
    this.mqttService.getDataSubject().subscribe((data) => {
      if (data) {
        this.updateChart(data);
      }
    });

    // Check if the page is reloaded or navigated away
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const storedData = this.loadLocalStorage();
        this.updateChartFromLocalStorage(storedData);
      }
    });
  }

  updateChart(data: any): void {
    // Parse the timestamp to a Date object
    const timestamp = new Date(data.measurement_timestamp);

    const newEntry = {
      name: data.component_no,
      value: data.current_temp_c,
    };

    if (!this.multi[0]) {
      this.multi[0] = {
        name: 'Temperature',
        series: [],
      };
    }

    this.multi[0].series.push(newEntry);

    // Keep only the last 20 entries
    if (this.multi[0].series.length > 20) {
      this.multi[0].series.shift();
    }

    // Trigger the change detection
    this.multi = [...this.multi];
  }

  updateChartFromLocalStorage(storedData: any[]): void {
    // Clear existing data
    this.multi[0].series = [];

    // Update with data from local storage
    storedData.forEach((data) => {
      this.updateChart(data);
    });
  }

  loadLocalStorage(): any[] {
    const storedData = JSON.parse(
      localStorage.getItem('measurementData') || '[]'
    );
    return storedData;
  }
}
