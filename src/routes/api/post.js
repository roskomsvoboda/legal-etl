
const express = require('express')
const router = express.Router()
const Tasks = require('../../tasks')
const tasks = new Tasks()

router.post('/:task', async (req, res) => {

    tasks.run(req.params.task)

    const r = tasks.getStatus(req.params.task)

    res.status(202).send(JSON.stringify({ success: true, task:r }))

})

module.exports = router