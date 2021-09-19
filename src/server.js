const express = require('express');
const app = express()

const api = require('./routes/api')

class Server {
    constructor(options){

        app.use('/api', api)

        app.use((req, res, next) => {
            res.status(404).send("Not found!")
        })

        app.use((err, req, res, next) => {
            res.status(500).send('Server Error!')
        })

        app.listen(options.port, () => {
            console.log(`App Server running at http://localhost:${options.port}`)
        })

    }

}

module.exports = Server