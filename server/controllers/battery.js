import fs from 'fs';
import csv from 'csv-parser';
import { promisify } from 'util';
import BatteryModel from "../models/battery.js"


const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// let previous_Volatage_Measured = 10;
// let previous_Current_Measured = 2;

// let previous_Volatage_Charge = 10;
// let previous_Current_Charge = 2;

let previous_Volatage_Measured = 3.4861;
let previous_Current_Measured = 0.0014;

let previous_Volatage_Charge = 0.002;
let previous_Current_Charge = -0.0006;

let previous_Battery_Percentage = 80;

export const sendSensorData = async (req,res) => {

    const volatageMeasured = Math.random() * (20);
    const currentMeasured = Math.random() * (6) + 1;

    const voltageCharge = Math.random() * (5);
    const currentCharge = Math.random() * (1.5) + 1;

    const sensorData = {
        voltageMeasured: volatageMeasured,
        currentMeasured: currentMeasured,
        voltageCharge: voltageCharge,
        currentCharge: currentCharge,
        temperature: Math.random() * 50,
        location: [Math.random() * 180 - 90, Math.random() * 360 - 180],
        batteryPercentage: calculate_Battery_Percentage(previous_Volatage_Measured,previous_Current_Measured,previous_Volatage_Charge,previous_Current_Charge,previous_Battery_Percentage)
    };

    previous_Volatage_Measured = volatageMeasured;
    previous_Current_Measured = currentMeasured;

    previous_Volatage_Charge = voltageCharge;
    previous_Current_Charge = currentCharge;

    previous_Battery_Percentage = sensorData.batteryPercentage;

    const battery = new BatteryModel(sensorData);
    // battery.save()
    //     .then(() => console.log('Sensor data saved : ', sensorData))
    //     .catch(err => console.error('Error saving sensor data : ', err));
    // return sensorData;
}

const calculate_Battery_Percentage = (VM,CM,VC,CC,prev_Battery_Capacity) => {

    const PowerConsumed = VM*CM; //(watts)
    const PowerCharge = VC*CC;  //(watts)

    const EnergyConsumed = PowerConsumed * 10 / 3600  //(watt-hours)
    const EnergyCharge = PowerCharge * 10 / 3600     //(watt-hours)

    const Battery_Perecentage = prev_Battery_Capacity - (EnergyConsumed - EnergyCharge)

    return Battery_Perecentage
}


export const write_to_file = async () => {

    const sensorDataArray = [];
    let sensorData = await sendSensorData();

    while (sensorData.batteryPercentage > 20) {
    sensorDataArray.push(sensorData);
    sensorData = await sendSensorData();
    }

    await writeFileAsync('Vehicle-10.json', JSON.stringify(sensorDataArray));
    console.log('Sensor data saved to JSON file.');
    return;
}

export const readSensorDataFromJSON = async () => {
    const sensorDataJSON = await readFileAsync('./JSON/Vehicle1.json', 'utf8');
    const sensorDataArray = JSON.parse(sensorDataJSON);
    return sensorDataArray;
}

export const sendSensorCSV = async (req,res) => {
    const sensorDataArray = await readSensorDataFromJSON();
    const sensorCSV = sensorDataArray.shift();

    sensorCSV.batteryPercentage = calculate_Battery_Percentage(previous_Volatage_Measured, previous_Current_Measured, previous_Volatage_Charge, previous_Current_Charge, previous_Battery_Percentage);

    previous_Volatage_Measured = sensorCSV.voltageMeasured;
    previous_Current_Measured = sensorCSV.currentMeasured;
    previous_Volatage_Charge = sensorCSV.voltageCharge;
    previous_Current_Charge = sensorCSV.currentCharge;
    previous_Battery_Percentage = sensorCSV.batteryPercentage;

    const battery = new BatteryModel(sensorCSV);
    // battery.save()
    //     .then(() => console.log('Sensor data saved : ', sensorCSV))
    //     .catch(err => console.error('Error saving sensor data : ', err));
    // // return sensorData;
}


export const readSensorDataFromCSV = async () => {
    const sensorDataCSV = [];
    const csvData = await readFileAsync('./CSV/00010.csv', 'utf8');

    const lines = csvData.split('\n');
    lines.forEach((line) => {
        const [voltageMeasured, currentMeasured, temperature, currentCharge, voltageCharge, time] = line.split(',');
        sensorDataCSV.push({
            voltageMeasured: parseFloat(voltageMeasured),
            currentMeasured: parseFloat(currentMeasured),
            currentCharge: parseFloat(currentCharge),
            voltageCharge: parseFloat(voltageCharge),
            temperature: parseFloat(temperature),
            location: [Math.random() * 180 - 90, Math.random() * 360 - 180],
            time: parseFloat(time)
        });
    });

    sensorDataCSV.shift();

    await writeFileAsync('./JSON/Vehicle10.json', JSON.stringify(sensorDataCSV, null, 2));
}