import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-temperature-graph',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './temperature-graph.component.html',
  styleUrls: ['./temperature-graph.component.scss'],
})
export class TemperatureGraphComponent implements OnInit {
  public multi: any[] = [];
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
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  public gradient = false;

  constructor(private mqttService: MqttService) {}

  ngOnInit(): void {
    this.mqttService.getTemperatureMessages().subscribe((message: string) => {
      const data = JSON.parse(message);
      this.updateChart(data);
    });

    // Initialize this.multi and then generate example data
    this.multi = [
      {
        name: 'Temperature Data',
        series: [],
      },
    ];
    // Generate example data for demonstration
    this.generateExampleData();
  }

  updateChart(data: any): void {
    const timestamp = new Date().toLocaleTimeString();
    const newEntry = {
      name: timestamp,
      value: data.value, // Adjust this according to your data structure
    };

    if (!this.multi[0]) {
      this.multi[0] = {
        name: 'Temperature Data',
        series: [],
      };
    }

    this.multi[0].series.push(newEntry);

    if (this.multi[0].series.length > 20) {
      this.multi[0].series.shift();
    }

    this.multi = [...this.multi];
  }

  // Method to generate example temperature data
  generateExampleData(): void {
    // Generate random temperature values and push them to the chart data
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date().toLocaleTimeString();
      const randomTemperature = Math.floor(Math.random() * (40 - 20 + 1)) + 20; // Generate random temperature between 20 and 40
      const exampleEntry = {
        name: timestamp,
        value: randomTemperature,
      };
      this.multi[0]?.series?.push(exampleEntry);
    }
  }
}
