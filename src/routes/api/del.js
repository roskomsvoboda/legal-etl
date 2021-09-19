
const express = require('express')
const router = express.Router()

router.delete('/:task', async (req, res) => {

    res.status(202).send(JSON.stringify({ status: 'OK', task:req.params.task }))

})

module.exports = router