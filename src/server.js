const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const fileUpload = require("express-fileupload")
const { MongoMemoryServer } = require('mongodb-memory-server')
const fs = require('fs')
const csv = require('csv-parser')

const app = express()
const cors = require("cors")
const { responseNetwork } = require("./utils.functions")
const mongoServer = new MongoMemoryServer()
const PORT = process.env.PORT || 3000
const CONTAINER_PATH = process.env.CONTAINER_PATH
const ReportModel = require('./report.model')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload({
    //useTempFiles: true,
    //tempFileDir: process.env.CONTAINER_PATH
}))

const dbConnect = async () => {
    const uri = await mongoServer.getUri()
  
    const mongooseOpts = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  
    await mongoose.connect(uri, mongooseOpts)
}

const dbDisconnect = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
}

app.get("/", (req, resp) => {
    return resp.status(200).json({
        timestamp: new Date().toISOString(),
        status: 200,
        message: "API challenge"
    })
})

app.post('/report', (req, resp) => {
    if (!req.files || Object.keys(req.files).length === 0){
        return responseNetwork(
            resp,
            true,
            400,
            "No files were uploaded or some data is empty."
        )
    }

    if(!req.body.company_name) {
        return responseNetwork(
            resp,
            true,
            422,
            'Unprocessable entity'
        )
    }

    const file = req.files    
    const filePath = `${CONTAINER_PATH}/${file['report'].name}`

    try {
        file['report'].mv(filePath, async function(err) {
            if(err) {
                console.error(err)
                return reject({error: true, message: 'Error in the server', status_code: 500})
            }
            
            let results = []            
            
            fs.createReadStream(filePath)
            .pipe(csv())
            //.pipe(csv(['UUID','VIN','MAKE','MODEL','MILEAGE','YEAR','PRICE','ZIP_CODE','CREATED_AT','UPDATED_AT']))
            //.pipe(csv(['uuid','vin','make','model','mileage','year','price','zip_code','create_date','updated_at']))
            //.on('data', (data) => results.push(data))
            .on('data', (data) => {
                const keys = Object.keys(data)
                let d = {}
                for(let i=0;i<keys.length;i++) {
                    d[keys[i].toLowerCase()] = data[keys[i]]
                }
                results.push(d)
            })
            .on('end', async () => {                
                dbConnect()
                const exists = await ReportModel.findOne({company_name: req.body.company_name})

                if(exists) {
                    await ReportModel.updateOne({company_name: req.body.company_name}, {$push: {data: results}})
                    return responseNetwork(
                        resp,
                        false,
                        201,
                        'successful'
                    )
                }
                else {
                    const report = ReportModel({
                        company_name: req.body.company_name,
                        data: [
                            // uuid: req.body.uuid,
                            // vin: req.body.vin,
                            // make: req.body.make,
                            // model: req.body.model,
                            // mileage: req.body.mileage,
                            // year: req.body.year,
                            // price: req.body.price,
                            // zip_code: req.body.zip_code,
                            // create_date: new Date(),
                            // updated_date: null
                            ...results
                        ]
                    });

                    const result = await report.save()

                    if(result) {
                        return responseNetwork(
                            resp,
                            false,
                            201,
                            'successful'
                        )
                    }

                    return responseNetwork(
                        resp,
                        true,
                        500,
                        'Something wrong happend'
                    )
                }
            });            
        })
    } catch(err) {
        console.error(err.message)
        return responseNetwork(
            resp,
            true,
            500,
            'Error in the server'
        )

    } finally {
        fs.unlinkSync(filePath)
    }    
})

app.get('/reports', async (req, resp) => {
    try {
        dbConnect()
        const reports = await ReportModel.find({})
        return responseNetwork(
            resp,
            false,
            200,
            'successful',
            reports
        )
    } catch (error) {
        console.error(error.message)
        return responseNetwork(
            resp,
            true,
            500,
            'error'
        )
    }
    
});
//app.use("/", user)
//app.use("/", userHistory)

app.listen(PORT, async () => {
    console.log(`Server start in the port: ${PORT}`)   
})