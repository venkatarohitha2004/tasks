
const Machine = require('../machine');
const FactoryMonitor = require('../Factorymonitor');
const Sensor = require('../sensor');
const fs = require('fs');

describe('Machine Health and Alerts', () => {
  test('Critical Machine Failure Risk when health < 50', () => {
    const machine = new Machine('M1');
    machine.addSensor(new Sensor('S1', 'Temperature', 120)); // -30
    machine.addSensor(new Sensor('S2', 'Pressure', 30));     // -30
    machine.addSensor(new Sensor('S3', 'Vibration', 80));    // -40
    // Health: 100 - 30 - 30 - 40 = 0
    expect(machine.getHealth()).toBeLessThan(50);
    expect(machine.getAlert()).toBe('Critical Machine Failure Risk');
  });

  test('Sensor Offline Warning for missing sensor', () => {
    const machine = new Machine('M2');
    machine.addSensor(new Sensor('S1', 'Temperature', 120));
    machine.addSensor(new Sensor('S2', 'Pressure', 250));
    // missing Vibration
    expect(machine.getAlert()).toBe('Sensor Offline Warning');
  });

  test('No alert for health at boundary (health = 70)', () => {
    const machine = new Machine('M3');
    machine.addSensor(new Sensor('S1', 'Temperature', 120)); // -30
    machine.addSensor(new Sensor('S2', 'Pressure', 40));     // 0
    machine.addSensor(new Sensor('S3', 'Vibration', 70));    // 0
    // Health: 100 - 30 = 70
    expect(machine.getHealth()).toBe(70);
    expect(machine.getAlert()).toBe('');
  });
});

describe('FactoryMonitor', () => {
  test('Average health calculation for factory', () => {
    const factory = new FactoryMonitor();
    const machine1 = new Machine('M1');
    machine1.addSensor(new Sensor('S1', 'Temperature', 110)); // -30
    machine1.addSensor(new Sensor('S2', 'Pressure', 50));     // 0
    machine1.addSensor(new Sensor('S3', 'Vibration', 60));    // 0
    // Health: 100 - 30 = 70
    const machine2 = new Machine('M2');
    machine2.addSensor(new Sensor('S1', 'Temperature', 120)); // -30
    machine2.addSensor(new Sensor('S2', 'Pressure', 30));     // -30
    machine2.addSensor(new Sensor('S3', 'Vibration', 80));    // -40
    // Health: 100 - 30 - 30 - 40 = 0
    factory.machines.set('M1', machine1);
    factory.machines.set('M2', machine2);
    expect(factory.getAverageHealth()).toBe(35);
  });

  test('Exception thrown for empty CSV', () => {
    fs.writeFileSync('empty.csv', '');
    expect(() => {
      FactoryMonitor.loadFromCSV('empty.csv');
    }).toThrow('CSV file is empty');
    fs.unlinkSync('empty.csv');
  });
});
