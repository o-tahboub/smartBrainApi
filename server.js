import cors from 'cors'
import bcrypt from 'bcrypt'
const bcryptSaltRounds = 10;
import knex from 'knex';
import express, { json } from 'express'
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())

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

const database = {
    users: [
        {
            
            id: '122',
            name: 'samson',
            email: 'samson@fictional.com',
            password: 'Piano',
            entries: 0,
            joined: '2023-06-12T09:19:22.019Z'
        },
        {
            id: '123',
            name: 'Josh',
            email: 'josh@fictional.com',
            password: 'potatoes',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send('this is working')
})

app.post('/signin', (req, res) => {
    const {email, password} = req.body
    /* if(email === database.users[0].email &&
        bcrypt.compare(password, database.users[0].password)) {
            res.json('signed in')
        } */ 
        if(email === database.users[0].email &&
        password === database.users[0].password) {
            const {id, name, email, entries, joined} = database.users[0]
            let userRes = {id, name, email, entries, joined}
            res.json(userRes)
        } else {
            res.status(400).json('sign in failed')
        } 
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    database.users.push({
        id: '126',
        name: name,
        email: email,
        password: bcrypt.hash(password, bcryptSaltRounds, function(err, hash) {
            console.log(hash)
            return hash
        }),
        entries: 0,
        joined: new Date()
    })
    res.json(database.users.at(-1))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    let userExists = false
    database.users.forEach(user => {
        if(user.id === id) {
            userExists = true
            res.json(user)
        } 
    });
    if(!userExists) res.status(400).json('user not found')
})

app.put('/image', (req, res) => {
    const { id } = req.body
    let userExists = false
    database.users.forEach(user => {
        if(user.id === id) {
            userExists = true
            user.entries++
            res.json(user.entries)
        } 
    });
    if(!userExists) res.status(400).json('user not found')
})

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})