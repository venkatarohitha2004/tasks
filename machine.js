// Machine.js
// Represents a machine that holds multiple sensors
const Sensor = require("./sensor");

class Machine {
  constructor(id) {
    this.id = id;
    this.sensors = [];
  }

  addSensor(sensor) {
    this.sensors.push(sensor);
  }

  getRequiredTypes() {
    return ["Temperature", "Pressure", "Vibration"];
  }

  computeHealthScore() {
    let warnings = new Set(); // ensure uniqueness
    let score = 100;

    // Precompute types for O(1) lookup
    const sensorTypes = new Set(this.sensors.map(s => s.type));

    // Missing sensors check
    const missingTypes = this.getRequiredTypes().filter(type => !sensorTypes.has(type));
    if (missingTypes.length > 0) {
      warnings.add(`Sensor Offline Warning: Missing ${missingTypes.join(", ")}`);
      return { score: 0, warnings: [...warnings] };
    }

    // Evaluate sensors
    for (let sensor of this.sensors) {
      switch (sensor.type) {
        case "Temperature":
          if (sensor.reading > 120) {
            score -= 40;
            warnings.add("High Temperature Risk");
          } else if (sensor.reading > 100) {
            score -= 20;
            warnings.add("Temperature slightly above safe limit");
          }
          break;

        case "Pressure":
          if (sensor.reading < 30) {
            score -= 40;
            warnings.add("Low Pressure Risk");
          } else if (sensor.reading < 40) {
            score -= 20;
            warnings.add("Pressure slightly below safe limit");
          }
          break;

        case "Vibration":
          if (sensor.reading > 90) {
            score -= 50;
            warnings.add("Extreme Vibration Risk");
          } else if (sensor.reading > 70) {
            score -= 25;
            warnings.add("Vibration slightly high");
          }
          break;

        default:
          warnings.add(`Unknown sensor type detected: ${sensor.type}`);
      }
    }

    if (score < 50) {
      warnings.add("⚠️ Critical Machine Failure Risk");
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    return { score, warnings: [...warnings] };
  }

  getHealth() {
    return this.computeHealthScore().score;
  }

  getSensorHealthStats() {
    if (this.sensors.length === 0) {
      return { avg: 0, min: 0, max: 0 };
    }

    let sum = 0;
    let min = Infinity;
    let max = -Infinity;

    for (let s of this.sensors) {
      const health = s.getHealthScore();
      sum += health;
      if (health < min) min = health;
      if (health > max) max = health;
    }

    return { avg: sum / this.sensors.length, min, max };
  }

  getAlert() {
    const result = this.computeHealthScore();
    return result.warnings.length > 0 ? result.warnings[0] : "";
  }
}

module.exports = Machine;
