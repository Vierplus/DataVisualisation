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
  measurementDate: string = '';

  // Chart options
  view: [number, number] = [230, 150];
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  cardColor: string = '#232837';
  customColors = [
    {
      name: 'Component #',
      value: '#be25b2', // Violet
    },
    {
      name: 'Temperature (°C)',
      value: '#ff0000', // Red
    },
    {
      name: 'Humidity (%)',
      value: '#00ff00', // Green
    },
    {
      name: 'Power Costs (kW/h)',
      value: '#ffcb00', // Orange
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
        this.loadMeasurementData(data);
      }
    });
  }

  /**
   * loads the data initially from the local storage
   */
  loadInitialData() {
    const storedData = this.mqttService.getStoredData();
    if (storedData.length > 0) {
      console.warn(storedData);
      this.measurementNumbers = Array.from(
        new Set(storedData.map((item) => item.component_no))
      );

      console.warn(this.measurementNumbers);
      this.data = this.transformData(storedData[0]);
      console.warn(this.data);
    }
  }

  /**
   * loads the component number for the select field
   * @param data
   */
  loadMeasurementData(data: any) {
    const componentNo = data.component_no;
    if (!this.measurementNumbers.includes(componentNo)) {
      this.measurementNumbers.push(componentNo);
    }
  }

  /**
   * updates the data
   * @param data
   */
  updateData(data: any) {
    this.data = this.transformData(data);
  }

  /**
   * transforms the data, so the cards can show the values
   * @param data
   * @returns transformed data
   */
  transformData(data: any): any[] {
    this.customColors.forEach((cc) => {
      if (cc.name === 'Dice Color') {
        cc.value = data.component_color_hex;
      }
    });
    this.measurementDate = data.measurement_timestamp;

    return [
      {
        name: 'Component #',
        value: data.component_no,
      },
      {
        name: 'Temperature (°C)',
        value: data.current_temp_c,
      },
      {
        name: 'Humidity (%)',
        value: data.current_humidity,
      },
      {
        name: 'Power Costs (kW/h)',
        value: data.current_price,
      },
      {
        name: 'Dice Color',
        value: data.component_color_name,
      },
    ];
  }

  /**
   * updates the data depend on the selected component number from the select field
   * @param event
   */
  onSelectMeasurement(event: any) {
    const componentNo = event.value;
    const storedData = this.mqttService.getStoredData();
    const filteredData = storedData.find(
      (item) => item.component_no == componentNo
    );

    if (filteredData) {
      this.measurementDate = filteredData.measurement_timestamp;
      this.updateData(filteredData);
    }
  }

  onSelect(event: Event) {
    console.log(event);
  }
}
