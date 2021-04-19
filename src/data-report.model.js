const { Schema, model } = require('mongoose');

const DataReportSchema = new Schema({
    uuid: {
        type: String,        
    },
    vin: {
        type: String
    },
    make: {
        type: String
    },
    model: {
        type: String
    },
    mileage: {
        type: String
    },
    year: {
        type: String
    },
    price: {
        type: Number
    },
    zip_code: {
        type: String
    },
    create_date: {
        type: String
    },
    updated_at: {
        type: String
    },
});

module.exports = model('DateReport', DataReportSchema);