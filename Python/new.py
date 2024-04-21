import csv
import random
import matplotlib.pyplot as plt

def calculate_Battery_Percentage(VM, CM, VC, CC, prev_Battery_Capacity):
    PowerConsumed = VM * CM  # (watts)
    PowerCharge = VC * CC  # (watts)

    EnergyConsumed = PowerConsumed * 10 / 3600  # (watt-hours)
    EnergyCharge = PowerCharge * 10 / 3600  # (watt-hours)

    Battery_Perecentage = prev_Battery_Capacity - (EnergyCharge - EnergyConsumed)

    return Battery_Perecentage

def sendSensorData(previous_data=None, num_entries=100):
    sensor_data_list = []
    if previous_data is None:
        previous_data = {
            "previous_Voltage_Measured": 10,
            "previous_Current_Measured": 2,
            "previous_Voltage_Charge": 10,
            "previous_Current_Charge": 2,
            "previous_Battery_Percentage": 80
        }

    with open('./00001.csv', mode='r') as file:
        csv_reader = csv.DictReader(file)
        for _ in range(num_entries):
            row = next(csv_reader)
            voltageMeasured = float(row['voltageMeasured'])
            currentMeasured = float(row['currentMeasured'])
            voltageCharge = float(row['voltageCharge'])
            currentCharge = float(row['currentCharge'])
            temperature = float(row['temperature'])

            sensorData = {
                "voltageMeasured": voltageMeasured,
                "currentMeasured": currentMeasured,
                "voltageCharge": voltageCharge,
                "currentCharge": currentCharge,
                "temperature": temperature,
                "location": [random.random() * 180 - 90, random.random() * 360 - 180],
                "batteryPercentage": calculate_Battery_Percentage(previous_data["previous_Voltage_Measured"],
                                                                   previous_data["previous_Current_Measured"],
                                                                   previous_data["previous_Voltage_Charge"],
                                                                   previous_data["previous_Current_Charge"],
                                                                   previous_data["previous_Battery_Percentage"])
            }

            previous_data["previous_Voltage_Measured"] = voltageMeasured
            previous_data["previous_Current_Measured"] = currentMeasured
            previous_data["previous_Voltage_Charge"] = voltageCharge
            previous_data["previous_Current_Charge"] = currentCharge
            previous_data["previous_Battery_Percentage"] = sensorData["batteryPercentage"]

            sensor_data_list.append(sensorData)

    return sensor_data_list, previous_data

# Write sensor data to CSV file
def write_to_csv(filename, num_entries):
    sensor_data_list, _ = sendSensorData(num_entries=num_entries)
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['voltageMeasured', 'currentMeasured', 'temperature', 'currentCharge', 'voltageCharge', 'batteryPercentage'])
        for sensorData in sensor_data_list:
            writer.writerow([sensorData['voltageMeasured'], sensorData['currentMeasured'], sensorData['temperature'],
                              sensorData['currentCharge'], sensorData['voltageCharge'], sensorData['batteryPercentage']])

    return sensor_data_list

sensor_data = write_to_csv('New_1.csv', 100)

# Extracting data for the graphs
time = range(len(sensor_data))
voltage = [entry["voltageMeasured"] for entry in sensor_data]
current = [entry["currentMeasured"] for entry in sensor_data]
battery = [entry["batteryPercentage"] for entry in sensor_data]

# Plotting voltage vs. time
plt.figure(figsize=(15, 5))
plt.subplot(1, 3, 1)
plt.plot(time, voltage)
plt.xlabel('Time')
plt.ylabel('Voltage (V)')
plt.title('Voltage vs. Time')

# Plotting current vs. time
plt.subplot(1, 3, 2)
plt.plot(time, current)
plt.xlabel('Time')
plt.ylabel('Current (A)')
plt.title('Current vs. Time')

# Plotting battery percentage vs. time
plt.subplot(1, 3, 3)
plt.plot(time, battery)
plt.xlabel('Time')
plt.ylabel('Battery Percentage (%)')
plt.title('Battery Percentage vs. Time')

plt.tight_layout()
plt.show()