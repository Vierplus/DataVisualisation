import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-humidity-graph',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './humidity-graph.component.html',
  styleUrls: ['./humidity-graph.component.scss'],
})
export class HumidityGraphComponent implements OnInit {
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
  public yAxisLabel = 'Humidity';
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
    this.mqttService.getHumidityMessages().subscribe((message: string) => {
      const data = JSON.parse(message);
      this.updateChart(data);
    });
  }

  updateChart(data: any): void {
    const timestamp = new Date().toLocaleTimeString();
    const newEntry = {
      name: timestamp,
      value: data.value, // Adjust this according to your data structure
    };

    if (!this.multi[0]) {
      this.multi[0] = {
        name: 'Humidity Data',
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
