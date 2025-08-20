// Sensor.js
class Sensor {
  constructor(id, type, reading) {
    this.id = id;
    this.type = type;

    // Ensure reading is always a valid number
    const num = parseFloat(reading);
    this.reading = isNaN(num) ? 0 : num;
  }

  // Helper method: normalized health score for this sensor
  getHealthScore() {
    // Simple scale logic: higher is healthier
    switch (this.type) {
      case "Temperature":
        return this.reading <= 100 ? 100 : Math.max(0, 100 - (this.reading - 100));
      case "Pressure":
        return this.reading >= 40 ? 100 : Math.max(0, this.reading * 2.5);
      case "Vibration":
        return this.reading <= 70 ? 100 : Math.max(0, 100 - (this.reading - 70) * 2);
      default:
        return 100; // Unknown types assumed OK
    }
  }
}

module.exports = Sensor;
