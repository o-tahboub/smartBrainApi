import cors from 'cors'
import bcrypt from 'bcrypt'
import knex from 'knex'
import 'dotenv/config'
import express, { json } from 'express'

/* Controllers */
import { signinHandler } from './ controllers/signin.js'
import { registerHandler } from './ controllers/register.js'
import { getProfileHandler } from './ controllers/profile.js'
import { imageHandler } from './ controllers/image.js'
import { clarifaiFaceDetectionHandler } from './ controllers/clarifaiFaceDetection.js'

/* Config */
const app = express()
const clarifaiConfig = {
    PAT: process.env.Clarifai_PAT,
    USER_ID: process.env.Clarifai_USER_ID,
    APP_ID: process.env.Clarifai_APP_ID,
  }
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
    getProfileHandler(req, res, db);
})

app.put('/image', (req, res) => {
    imageHandler(req, res, db);
})

app.post('/clarifaiFaceDetection', (req, res) => {
    clarifaiFaceDetectionHandler(req, res, clarifaiConfig);
})

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})