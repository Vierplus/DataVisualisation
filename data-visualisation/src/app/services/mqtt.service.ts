import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import mqtt, { MqttClient } from 'mqtt';

// Interface with all the data definition from the mongodb
interface MeasurementData {
  measurement_timestamp: string;
  component_no: number;
  component_color_hex: string;
  component_color_name: string;
  current_temp_c: number;
  current_humidity: number;
  current_power_consumption: number;
  current_price: number;
}

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  /**
   * Topic from the mosquitto broker
   */
  topic = 'fbs_vierplus_4p';
  private client: MqttClient;
  private dataSubject: BehaviorSubject<MeasurementData | null> =
    new BehaviorSubject<MeasurementData | null>(null);

  constructor() {
    this.client = mqtt.connect('ws://100.108.16.72:9001'); // Use WebSocket endpoint

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe(this.topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to topic ' + this.topic);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      if (topic === this.topic) {
        const data: MeasurementData = JSON.parse(message.toString());
        this.dataSubject.next(data);
        this.updateLocalStorage(data);
      }
    });

    // Handle reconnection
    this.client.on('reconnect', () => {
      console.log('Reconnecting to MQTT broker');
      this.client.subscribe('fbs_vierplus_4p');
    });

    this.client.on('error', (error) => {
      console.error('MQTT error:', error);
    });
  }

  /**
   * subcribe to get the data
   * @returns data as object
   */
  getDataSubject() {
    return this.dataSubject.asObservable();
  }

  /**
   * updates the local storage with the data,
   * so its stored localy and can get used after reload of page
   * @param data
   */
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

  /**
   * gets the data from the local storage
   * @returns data as object
   */
  getStoredData(): MeasurementData[] {
    const storageKey = 'measurementData';
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  }
}
