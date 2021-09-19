

const Server = require('./src/server')

const DataBase = require('./src/storage/db/connect')

const database = new DataBase()

database.CheckConnectDB()

const server = new Server({
    port:process.env.PORT || 3010
})


