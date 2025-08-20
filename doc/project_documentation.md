# Factory Monitoring Project Documentation

## Introduction
This project simulates a factory monitoring system using Node.js. It processes sensor data, calculates machine health, generates alerts, and demonstrates real-time and multi-threaded data handling.

## Architecture
- **main.js**: Entry point. Handles sensor data simulation, performance comparison, and multi-threading.
- **machine.js**: Defines the Machine class, health calculation, and alert logic.
- **sensor.js**: Defines the Sensor class.
- **Factorymonitor.js**: Manages multiple machines, aggregates health, and handles CSV loading.
- **data.csv**: Example sensor data file.
- **test/**: Contains Jest unit tests.

## Features
- Health scoring for machines based on sensor readings.
- Alerts for critical machine failure and offline sensors.
- Real-time sensor data simulation using setInterval.
- Synchronous vs asynchronous performance comparison.
- Multi-threaded computation using Node.js Worker Threads.
- Average health calculation for all machines.
- Exception handling for empty CSV files.

## Health Calculation Logic
- Start at 100.
- Subtract 30 if Temperature > 100.
- Subtract 30 if Pressure < 40.
- Subtract 40 if Vibration > 70.
- If any required sensor is missing, health is 0 and warning is "Sensor Offline Warning".
- If health < 50, warning is "Critical Machine Failure Risk".

## Usage
1. Install dependencies:
   ```
   npm install
   ```
2. Run the main program:
   ```
   node main.js
   ```
3. Run unit tests:
   ```
   npx jest
   ```

## Real-Time & Multi-Threaded Simulation
- Real-time updates: `main.js` uses setInterval to simulate live sensor data.
- Async vs Sync: Performance comparison functions in `main.js`.
- Worker Threads: Heavy computation offloaded in `main.js`.

## Example CSV Format
```
MachineID,SensorID,Type,Reading
M1,S1,Temperature,120
M1,S2,Pressure,30
M1,S3,Vibration,80
```

## Extending the Project
- Add more sensor types or machine parameters.
- Integrate with a database for persistent storage.
- Add a web interface for visualization.
- Implement advanced alerting and notification systems.

## License
MIT
