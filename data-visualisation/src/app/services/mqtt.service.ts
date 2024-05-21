import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import mqtt, { MqttClient } from 'mqtt';

interface MeasurementData {
  measurement_no: number;
  measurement_timestamp: string;
  component_no: number;
  component_color_hex: string;
  component_color_name: string;
  current_temp_c: number;
  current_temp_f: number;
  current_humidity: number;
  current_power_consumption: number;
}

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: MqttClient;
  private dataSubject: BehaviorSubject<MeasurementData | null> =
    new BehaviorSubject<MeasurementData | null>(null);

  constructor() {
    this.client = mqtt.connect('ws://100.108.16.72:9001'); // Use WebSocket endpoint

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('fbs_vierplus');
    });

    this.client.on('message', (topic, message) => {
      if (topic === 'fbs_vierplus') {
        const data: MeasurementData = JSON.parse(message.toString());
        this.dataSubject.next(data);
      }
    });
  }

  getDataSubject() {
    return this.dataSubject.asObservable();
  }
}
