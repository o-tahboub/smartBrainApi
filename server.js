import cors from 'cors'
import bcrypt from 'bcrypt'
import knex from 'knex'
import express, { json } from 'express'

/* Controllers */
import { signinHandler } from './ controllers/signin.js'
import { registerHandler } from './ controllers/register.js'

/* Config */
const app = express()
const bcryptSaltRounds = 10
const port = 3000
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '',
      database : 'smart-brain'
    }
  });

/* Middleware */
app.use(express.json())
app.use(cors())

/* Routes */
app.get('/', (req, res) => {
    res.send('this is working')
})

app.post('/signin', (req, res) => {
    signinHandler(req, res, bcrypt, db)
})

app.post('/register', (req, res) => {
    registerHandler(req, res, bcrypt, bcryptSaltRounds, db);   
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params

    db('users').where({id})
    .then(user => {
        if(user[0]) {
            res.json(user[0])
        } else {
            res.status(400).json('could not find user')
        }
    })
    .catch(err => res.status(500).json('profile error'));
})

app.put('/image', (req, res) => {
    const { id } = req.body
    db('users').where({id}).increment('entries').returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(err => res.status(500).json('could not update entries'));
})

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})