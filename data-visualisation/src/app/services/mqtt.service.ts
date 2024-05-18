import { Injectable } from '@angular/core';
import mqtt from 'mqtt';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: mqtt.MqttClient;
  private temperatureMessages: Subject<string> = new Subject<string>();
  private humidityMessages: Subject<string> = new Subject<string>();

  constructor() {
    this.client = mqtt.connect('ws://100.108.16.72:9001'); // Use WebSocket endpoint

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('temperature');
      this.client.subscribe('humidity');
    });

    this.client.on('message', (topic, message) => {
      const msg = message.toString();
      if (topic === 'temperature') {
        this.temperatureMessages.next(msg);
      } else if (topic === 'humidity') {
        this.humidityMessages.next(msg);
      }
    });
  }

  getTemperatureMessages(): Observable<string> {
    return this.temperatureMessages.asObservable();
  }

  getHumidityMessages(): Observable<string> {
    return this.humidityMessages.asObservable();
  }
}
