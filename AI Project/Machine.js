import { Sensor } from './Sensor.js';

export class Machine {
  constructor(id, temp, pressure, vibration) {
    this.id = id;
    this.sensors = {
      temperature: new Sensor('temperature', temp),
      pressure: new Sensor('pressure', pressure),
      vibration: new Sensor('vibration', vibration),
    };
  }

  calculateHealth() {
    const t = this.sensors.temperature.value;
    const p = this.sensors.pressure.value;
    const v = this.sensors.vibration.value;
    const raw = 100 - (t / 2 + p / 10 + v * 20);
    return Number(raw.toFixed(2));
  }

  isAlert() {
    return this.calculateHealth() < 50;
  }
}


