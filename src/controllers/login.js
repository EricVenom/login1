const knex = require('../services/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtPassword = require('../jwtpass');

const root = async (req, res) => {
    return res.json({ message: "I'm running." })
}

const signUp = async (req, res) => {
    const { name, username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(401).json({ message: 'All fields should be provided.' })
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);
        await knex('all_users').insert({
            name,
            username,
            email,
            password: encryptedPassword
        })

        return res.status(201).json()
    } catch (error) {
        const [invalidEmail] = await knex('all_users').where('email', email);
        if (invalidEmail) {
            return res.status(401).json({ message: 'This email is already being used by another account.' })
        }

        const [invalidUsername] = await knex('all_users').where('username', username);
        if (invalidUsername) {
            return res.status(401).json({ message: 'Username is already taken.' })
        }
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ message: "All fields must be filled in." })
    }

    try {
        const [user] = await knex.select().from('all_users').where('email', email)
        const { id, email: userEmail, password: userPassword } = user

        const decryptedPassword = await bcrypt.compare(password, userPassword)
        if (!decryptedPassword) {
            return res.status(401).json({ message: "Wrong password." })
        }

        const token = jwt.sign({ id: id, email: userEmail }, jwtPassword, { expiresIn: '12h' })
        return res.status(200).json({ id, userEmail, token })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = {
    root,
    signUp,
    login
}