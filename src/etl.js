const { workerData, parentPort } = require('worker_threads')
const path = require('path')
const fs = require('fs')
const stringify = require('csv-stringify')
const DataBase = require('./storage/db//connect')
const Sequelize = require("sequelize")

const { DataTypes } = require("sequelize")

const HttpRequests = require('./libs/root/HttpRequests')

class ETL {

    constructor(name) {

        this.name = name

    }

    async runExtrapolation() {

        const part = path.join(__dirname, 'ETL', '1-extract', `${this.name}.js`)

        let self = {}

        self.httpreq = new HttpRequests({})

        try {
            if (fs.existsSync(part)) {
                this.extract = require(part)
                if(this.extract.extrapolation) {
                    this.extract_data = await this.extract.extrapolation.call(self)
                }else{
                    throw Error(`Not module extrapolation by ${this.name}.js`)
                }
            }
        } catch (err) {
            console.error(err)
        }

        self.httpreq.destroy()

    }

    async runTransformation() {

        const part = path.join(__dirname, 'ETL', '2-transform', `${this.name}.js`)

        let self = {}

        try {
            if (fs.existsSync(part)) {
                this.transform = require(part) 
                if(this.transform.transformation) {
                    this.transform_data = await this.transform.transformation.call(self, this.extract_data)
                }else{
                    throw Error(`Not module transformation by ${this.name}.js`)
                }
                   
            }
        } catch (err) {
            console.error(err)
        }

    }


    async runLoad() {

        const part = path.join(__dirname, 'ETL', '3-load', `${this.name}.js`)

        let self = {exports:{},db:{}}

        self.exports.csv = ({data,name = this.name,header = false,delimiter = ';'}) => {
            
            let csv = stringify(data, {
                header,
                delimiter
            })

            const p = path.join(__dirname, 'storage', 'export-file', `${name}.csv`)

            csv.pipe(fs.createWriteStream(p))
        }

        const db = new DataBase()

        const nameDB = await db.getDB()

        try {
            if (fs.existsSync(part)) {
                this.load = require(part)

                if(this.load.model) {

                    self.db.save = async (ndb,data) => {

                        const sequelize_db = new Sequelize(nameDB[ndb].connect_str)
                        
                        await sequelize_db.authenticate()

                        let model = {}

                        for (let i in this.load.model.fields){

                            let n =  this.load.model.fields[i].indexOf('(')

                            let type = n>1 ? this.load.model.fields[i].substring(0,n) :  this.load.model.fields[i]

                            let arg = n>1 ? this.load.model.fields[i].substring(n+1,this.load.model.fields[i].length-1) :  null

                            if(arg){
                                model[i] = Sequelize[type](arg) 
                            }else{
                                model[i] = DataTypes[this.load.model.fields[i]]
                            }
                        
                        }
    
                        const table = await sequelize_db.define(this.name,model)

                        await table.sync({ force: true })

                        await table.bulkCreate(data, { returning: false,...this.load.model.options }) 

                        sequelize_db.close()
                  
                    }

                }else{
                    throw Error(`Not model database`)
                }


                if(this.load.loading) {
                    await this.load.loading.call(self, this.transform_data)
                }else{
                    throw Error(`Not module loading by ${this.name}.js`)
                }
                
            }
        } catch (err) {
            console.error(err)
        }

    }

}


const factoryETL = async () => {

    if(!workerData.nameETL) throw Error('factoryETL: parameters not specified "nameETL"')

    try {
        const etl = new ETL(workerData.nameETL)

        await etl.runExtrapolation()
        
        await etl.runTransformation()
    
        await etl.runLoad()

    } catch (e) {
        return e.message
    }

}

factoryETL()
