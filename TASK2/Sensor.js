export class Sensor {
  constructor(type, value) {
    this.type = type;
    this.value = value;
    this.validate();
  }

  validate() {
    if (typeof this.value !== 'number' || Number.isNaN(this.value)) {
      throw new Error(`Invalid value for ${this.type} sensor: ${this.value}`);
    }
  }
}


