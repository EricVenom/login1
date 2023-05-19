const express = require('express')
const routes = express()
const { login, signUp } = require('../controllers/login')

routes.post('/signup', signUp)
routes.post('/login', login)

module.exports = routes