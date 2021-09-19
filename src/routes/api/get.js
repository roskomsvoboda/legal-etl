const express = require('express')
const router = express.Router()
const Tasks = require('../../tasks')
const tasks = new Tasks()

router.get('/', async (req, res) => {

    const r = tasks.getStatus()

    res.status(200).send(JSON.stringify({ success: true,tasks:r }));

})


module.exports = router