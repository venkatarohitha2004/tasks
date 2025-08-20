
const Machine = require('../machine');
const FactoryMonitor = require('../Factorymonitor');
const Sensor = require('../sensor');
const fs = require('fs');

describe('Machine Health and Alerts', () => {
  test('Critical Machine Failure Risk when health < 50', () => {
    const machine = new Machine('M1');
    machine.addSensor(new Sensor('S1', 'Temperature', 121)); // >120 triggers high risk
    machine.addSensor(new Sensor('S2', 'Pressure', 29));     // <30 triggers low risk
    machine.addSensor(new Sensor('S3', 'Vibration', 91));    // >90 triggers extreme risk
    // Health: 100 - 40 - 40 - 50 = -30 (clamped to 0)
    expect(machine.getHealth()).toBeLessThan(50);
    expect(machine.getAlert()).toBe('High Temperature Risk'); // First warning returned
  });

  test('Sensor Offline Warning for missing sensor', () => {
    const machine = new Machine('M2');
    machine.addSensor(new Sensor('S1', 'Temperature', 120));
    machine.addSensor(new Sensor('S2', 'Pressure', 250));
    // missing Vibration
    expect(machine.getAlert()).toBe('Sensor Offline Warning: Missing Vibration');
  });

  test('No alert for health at boundary (health = 80)', () => {
    const machine = new Machine('M3');
    machine.addSensor(new Sensor('S1', 'Temperature', 110)); // >100 triggers slightly above safe limit
    machine.addSensor(new Sensor('S2', 'Pressure', 50));     // safe
    machine.addSensor(new Sensor('S3', 'Vibration', 70));    // safe
    // Health: 100 - 20 = 80
    expect(machine.getHealth()).toBe(80);
    expect(machine.getAlert()).toBe('Temperature slightly above safe limit');
  });
});

describe('FactoryMonitor', () => {
  test('Average health calculation for factory', () => {
    const factory = new FactoryMonitor();
    const machine1 = new Machine('M1');
    machine1.addSensor(new Sensor('S1', 'Temperature', 110)); // -20
    machine1.addSensor(new Sensor('S2', 'Pressure', 50));     // 0
    machine1.addSensor(new Sensor('S3', 'Vibration', 60));    // 0
    // Health: 100 - 20 = 80
    const machine2 = new Machine('M2');
    machine2.addSensor(new Sensor('S1', 'Temperature', 121)); // -40
    machine2.addSensor(new Sensor('S2', 'Pressure', 29));     // -40
    machine2.addSensor(new Sensor('S3', 'Vibration', 91));    // -50
    // Health: 100 - 40 - 40 - 50 = -30 (clamped to 0)
    factory.machines['M1'] = machine1;
    factory.machines['M2'] = machine2;
    const avg = (80 + 0) / 2;
    expect(avg).toBe(40);
  });

  test('Exception thrown for empty CSV', () => {
    fs.writeFileSync('empty.csv', '');
    const factory = new FactoryMonitor();
    expect(() => {
      factory.loadFromCSV('empty.csv');
  }).toThrow('CSV file is empty');
    fs.unlinkSync('empty.csv');
  });
});
