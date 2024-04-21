import csv
import random
import matplotlib.pyplot as plt

def sendSensorData(previous_data=None):
    if previous_data is None:
        previous_data = {
            "previous_Volatage_Measured": 10,
            "previous_Current_Measured": 2,
            "previous_Volatage_Charge": 10,
            "previous_Current_Charge": 2,
            "previous_Battery_Percentage": 80
        }

    volatageMeasured = random.random() * 20
    currentMeasured = random.random() * 6 + 1
    voltageCharge = random.random() * 5
    currentCharge = random.random() * 1.5 + 1

    sensorData = {
        "voltageMeasured": volatageMeasured,
        "currentMeasured": currentMeasured,
        "voltageCharge": voltageCharge,
        "currentCharge": currentCharge,
        "temperature": random.random() * 50,
        "location": [random.random() * 180 - 90, random.random() * 360 - 180],
        "batteryPercentage": calculate_Battery_Percentage(previous_data["previous_Volatage_Measured"],
                                                           previous_data["previous_Current_Measured"],
                                                           previous_data["previous_Volatage_Charge"],
                                                           previous_data["previous_Current_Charge"],
                                                           previous_data["previous_Battery_Percentage"])
    }

    previous_data["previous_Volatage_Measured"] = volatageMeasured
    previous_data["previous_Current_Measured"] = currentMeasured
    previous_data["previous_Volatage_Charge"] = voltageCharge
    previous_data["previous_Current_Charge"] = currentCharge
    previous_data["previous_Battery_Percentage"] = sensorData["batteryPercentage"]

    return sensorData, previous_data

def calculate_Battery_Percentage(VM, CM, VC, CC, prev_Battery_Capacity):
    PowerConsumed = VM * CM  # (watts)
    PowerCharge = VC * CC  # (watts)

    EnergyConsumed = PowerConsumed * 10 / 3600  # (watt-hours)
    EnergyCharge = PowerCharge * 10 / 3600  # (watt-hours)

    Battery_Perecentage = prev_Battery_Capacity - (EnergyConsumed - EnergyCharge)

    return Battery_Perecentage

# Write sensor data to CSV file
def write_to_csv(filename, num_entries):
    sensor_data = []
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['voltageMeasured', 'currentMeasured', 'Temperature_measured', 'Current_charge', 'Voltage_charge', 'Battery_Percentage'])

        previous_data = None
        for _ in range(num_entries):
            sensorData, previous_data = sendSensorData(previous_data)
            writer.writerow([sensorData['voltageMeasured'], sensorData['currentMeasured'], sensorData['temperature'],
                              sensorData['currentCharge'], sensorData['voltageCharge'], sensorData['batteryPercentage']])
            sensor_data.append(sensorData)

    return sensor_data

sensor_data = write_to_csv('sensor_data.csv', 100)

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