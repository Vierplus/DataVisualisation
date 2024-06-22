import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { MqttService } from '../../services/mqtt.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  data: any[] = []; // Store the filtered data
  measurementNumbers: number[] = [];

  // Chart options
  view: [number, number] = [800, 200];
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  cardColor: string = '#232837';
  customColors = [
    {
      name: 'Temperature (°C)',
      value: '#ff0000', // Red
    },
    {
      name: 'Humidity (%)',
      value: '#00ff00', // Green
    },
    {
      name: 'Power Consumption (kW)',
      value: '#ffff00', // Yellow
    },
    {
      name: 'Dice Color',
      value: '#ddd', // Yellow
    },
  ];

  constructor(private mqttService: MqttService) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.mqttService.getDataSubject().subscribe((data) => {
      if (data) {
        this.updateData(data);
      }
    });
  }

  loadInitialData() {
    const storedData = this.mqttService.getStoredData();
    if (storedData.length > 0) {
      this.measurementNumbers = Array.from(
        new Set(storedData.map((item) => item.measurement_no))
      );
      this.data = this.transformData(storedData[0]);
    }
  }

  updateData(data: any) {
    this.data = this.transformData(data);
  }

  transformData(data: any): any[] {
    this.customColors.forEach((cc) => {
      if (cc.name === 'Dice Color') {
        cc.value = data.component_color_name;
      }
    });

    return [
      {
        name: 'Temperature (°C)',
        value: data.current_temp_c,
      },
      {
        name: 'Humidity (%)',
        value: data.current_humidity,
      },
      {
        name: 'Power Used (kW)',
        value: data.current_power_consumption,
      },
      {
        name: 'Dice Color',
        value: data.component_color_name,
      },
    ];
  }

  onSelectMeasurement(event: any) {
    const measurementNo = event.value;
    const storedData = this.mqttService.getStoredData();
    const filteredData = storedData.find(
      (item) => item.measurement_no == measurementNo
    );
    if (filteredData) {
      this.updateData(filteredData);
    }
  }

  onSelect(event: Event) {
    console.log(event);
  }
}