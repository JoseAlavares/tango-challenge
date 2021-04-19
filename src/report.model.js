const { Schema, model } = require('mongoose');
//const DataReportSchema = require('./data-report.model');
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

const ReportSchema = new Schema({
  company_name: {
    type: String
  },
  data: [DataReportSchema]
});

module.exports = model('Report', ReportSchema);