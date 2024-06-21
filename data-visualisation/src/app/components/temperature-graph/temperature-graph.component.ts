import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
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
    domain: ['#ff0000', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  public gradient = false;

  constructor(private mqttService: MqttService) {}

  ngOnInit(): void {
    console.warn('ngOnInit');

    // Subscribe to the MQTT service to receive data
    this.mqttService.getDataSubject().subscribe((data) => {
      console.warn('test', data);
      if (data) {
        console.warn(data);
        this.updateChart(data);
      }
    });
  }

  updateChart(data: any): void {
    // Parse the timestamp to a Date object
    const timestamp = new Date(data.measurement_timestamp);

    const newEntry = {
      name: data.measurement_no,
      value: data.current_temp_c, // Adjust this according to your data structure
    };

    if (!this.multi[0]) {
      this.multi[0] = {
        name: 'Temperature',
        series: [],
      };
    }

    this.multi[0].series.push(newEntry);

    if (this.multi[0].series.length > 20) {
      this.multi[0].series.shift();
    }

    this.multi = [...this.multi];
  }
}
