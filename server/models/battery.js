import mongoose from "mongoose"

const BatteryModel_Schema = new mongoose.Schema({
    voltageMeasured: { type: Number, default: 0},
    currentMeasured: { type: Number, default: 0},
    voltageCharge: { type: Number, default: 0},
    currentCharge: { type: Number, default: 0},
    temperature: {type: Number, default: 0 },
    location: { type: [Number], default: [0, 0] },
    batteryPercentage: {type: Number, default: 100}

})

export default mongoose.model('BatteryModel', BatteryModel_Schema)