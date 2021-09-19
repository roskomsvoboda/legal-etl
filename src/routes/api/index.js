const express = require('express')
const router = express.Router()

const get = require('./get')
const post = require('./post')
const del = require('./del')


const setHeader = (req, res, next) => {
    res.set({
      'Content-Type': 'application/json',
      'charset': 'UTF-8',
    });
    next();
  }


router.use('/',[setHeader], get)
router.use('/',[setHeader], post)
router.use('/',[setHeader], del)


module.exports = router