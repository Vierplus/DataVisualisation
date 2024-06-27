import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { MqttService } from '../../services/mqtt.service';
import { NavigationStart, Router } from '@angular/router';

interface ChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-power-costs-graph',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './power-costs-graph.component.html',
  styleUrl: './power-costs-graph.component.scss',
})
export class PowerCostsGraphComponent implements OnInit {
  public multi: ChartData[] = [{ name: 'Power Costs', series: [] }];
  public view: [number, number] = [700, 400];

  public showLegend = true;
  public showLabels = true;
  public animations = true;
  public xAxis = true;
  public yAxis = true;
  public showYAxisLabel = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Time';
  public yAxisLabel = 'Power Costs';
  public timeline = true;

  public colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ffcb00', '#A10A28', '#C7B42C', '#AAAAAA'],
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

  /**
   * updates the chart with the given data
   * @param data
   */
  updateChart(data: any): void {
    const newEntry = {
      name: data.component_no,
      value: data.current_price,
    };

    if (!this.multi[0]) {
      this.multi[0] = {
        name: 'Humidity',
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

  /**
   * updates the chart with the data from the local storage
   * @param storedData
   */
  updateChartFromLocalStorage(storedData: any[]): void {
    // Clear existing data
    this.multi[0].series = [];

    // Update with data from local storage
    storedData.forEach((data) => {
      this.updateChart(data);
    });
  }

  /**
   * loads the data from the local storage
   * @returns storedData
   */
  loadLocalStorage(): any[] {
    const storedData = JSON.parse(
      localStorage.getItem('measurementData') || '[]'
    );
    return storedData;
  }
}
