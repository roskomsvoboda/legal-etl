const path = require('path')
const Graceful = require('@ladjs/graceful')
const Bree = require('bree')

class Tasks {

    static #bree
    static #graceful
    static #jobs = {}

    constructor(){

        if(!Tasks.#bree) {

            Tasks.#bree = new Bree({
                jobs:[], 
                root:false, 
                errorHandler: (error, workerMetadata) => {
                    console.log(error)
                }
            })

            Tasks.#graceful = new Graceful({ brees: [Tasks.#bree] })
            Tasks.#graceful.listen()

        }

    }

    run(name) {

        if(!Object.keys(Tasks.#jobs).includes(name)){

            Tasks.#addTask(name)
            Tasks.#jobs[name] = {name,status:'add'}

        }

        if(Object.keys(Tasks.#jobs).includes(name) && Tasks.#jobs[name].status != 'run' ){

            Tasks.#bree.on('worker created', (name) => {
                Tasks.#jobs[name] = {name,status:'run'}
            })
            
            Tasks.#bree.on('worker deleted', (name) => {
                Tasks.#jobs[name] = {name,status:'stop'}
            })

            Tasks.#bree.run(name)
        }

    }

    stop(name) {

        if(Object.keys(Tasks.#jobs).includes(name)){

            Tasks.#bree.stop(name)
            
        }

    }

    getStatus(name){
        
        if(name){
            return Tasks.#jobs[name]
        }

        return Tasks.#jobs

    }

    static #addTask(name) {

        const op = {
            name: name,
            path: path.join(__dirname,`etl.js`),
            worker: {
                workerData: {nameETL: name},
            },
        }

        return Tasks.#bree.add(op)

    }

}

module.exports = Tasks
