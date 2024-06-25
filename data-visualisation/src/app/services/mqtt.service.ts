import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import mqtt, { MqttClient } from 'mqtt';

interface MeasurementData {
  measurement_timestamp: string;
  component_no: number;
  component_color_hex: string;
  component_color_name: string;
  current_temp_c: number;
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
        this.updateLocalStorage(data);
      }
    });

    // Handle reconnection
    this.client.on('reconnect', () => {
      console.log('Reconnecting to MQTT broker');
      this.client.subscribe('fbs_vierplus');
    });

    this.client.on('error', (error) => {
      console.error('MQTT error:', error);
    });
  }

  getDataSubject() {
    return this.dataSubject.asObservable();
  }

  private updateLocalStorage(data: MeasurementData) {
    const storageKey = 'measurementData';
    let storedData: MeasurementData[] = JSON.parse(
      localStorage.getItem(storageKey) || '[]'
    );

    // Check if the data already exists
    const existingIndex = storedData.findIndex(
      (item) => item.component_no === data.component_no
    );
    if (existingIndex !== -1) {
      // Data already exists, update it if needed
      storedData[existingIndex] = data;
    } else {
      // Data doesn't exist, add it
      storedData.push(data);
    }

    localStorage.setItem(storageKey, JSON.stringify(storedData));
  }

  getStoredData(): MeasurementData[] {
    const storageKey = 'measurementData';
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  }
}
