
const Sequelize = require("sequelize")
require('dotenv').config()

class DataBase {

    constructor(){

        this.connect_str = {
            POSTGRES_STR: process.env.POSTGRES_STR,
            MYSQL_STR: process.env.MYSQL_STR,
            MARIADB_STR: process.env.MARIADB_STR,
            SQLITE_STR: process.env.SQLITE_STR,
            MSSQL_STR: process.env.MSSQL_STR,
        }

    }

    async getDB(){

        let db = {}

        for (const BD_STR in this.connect_str) {
    
            if (this.connect_str[BD_STR]){

                let db_name = BD_STR.slice(0,-4)

                db[db_name] = {connect_str: this.connect_str[BD_STR]}
    
            }
        }

        return db
    }

    // save(){

    //     const User = sequelize.define("user", {
    //         id: {
    //           type: Sequelize.INTEGER,
    //           autoIncrement: true,
    //           primaryKey: true,
    //           allowNull: false
    //         },
    //         name: {
    //           type: Sequelize.STRING,
    //           allowNull: false
    //         },
    //         age: {
    //           type: Sequelize.INTEGER,
    //           allowNull: false
    //         }
    //       });

    //     User.bulkCreate([
    //         { username: 'barfooz', isAdmin: true },
    //         { username: 'foo', isAdmin: true },
    //         { username: 'bar', isAdmin: false }
    //       ], { returning: true }) // will return all columns for each row inserted
    //       .then((result) => {
    //         console.log(result);
    //       });
    // }

    CheckConnectDB(){

        for (const BD_STR in this.connect_str) {
    
            if (this.connect_str[BD_STR]){

                let sequelize_db

                try {
                    sequelize_db = new Sequelize(this.connect_str[BD_STR])
                } catch (e) {
                    console.error(e)
                }  
    
                sequelize_db.authenticate().then(() => {

                    console.log('Connect to the database:', this.connect_str[BD_STR]) 
    
                    sequelize_db.close()
    
                }).catch(err => {

                    console.error('not connect to the database:', err) 
    
                    throw Error(err)
    
                })
    
            }
        
        }

    }

}

module.exports = DataBase