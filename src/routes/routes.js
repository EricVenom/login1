const express = require('express')
const routes = express()
const { root, login, signUp } = require('../controllers/login')

routes.get('/', root)
routes.post('/signup', signUp)
routes.post('/login', login)

module.exports = routes