const { expect } = require('chai');
const Machine = require('./machine');
const FactoryMonitor = require('./Factorymonitor');
const fs = require('fs');

describe('Machine Health and Alerts', () => {
  it('should flag critical failure risk for health < 50', () => {
    const machine = new Machine({ temp: 120, pressure: 250, vibration: 1.5 });
    expect(machine.health).to.be.below(50);
    expect(machine.getAlert()).to.equal('Critical Machine Failure Risk');
  });

  it('should warn for missing sensor', () => {
    const machine = new Machine({ temp: 120, pressure: 250 }); // missing vibration
    expect(machine.getAlert()).to.equal('Sensor Offline Warning');
  });

  it('should not alert for health exactly 50', () => {
    const machine = new Machine({ temp: 100, pressure: 200, vibration: 1.0 }); // adjust to get health=50
    machine.health = 50; // force boundary
    expect(machine.getAlert()).to.equal('');
  });
});

describe('FactoryMonitor', () => {
  it('should calculate average health', () => {
    const machines = [
      { health: 60 },
      { health: 30 }
    ];
    const factory = new FactoryMonitor(machines);
    expect(factory.getAverageHealth()).to.equal(45);
  });

  it('should throw exception for empty CSV', () => {
    expect(() => {
      fs.readFileSync('empty.csv', 'utf8'); // Simulate empty CSV
      FactoryMonitor.loadFromCSV('empty.csv');
    }).to.throw();
  });
});
