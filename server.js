import cors from 'cors'
import bcrypt from 'bcrypt'
import knex from 'knex'
import express, { json } from 'express'

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
    const {email, password} = req.body

    db('login').where('email', email).select('email', 'hash')
    .then(loginArr => {
        const isValid = bcrypt.compare(password, loginArr[0].hash);
        if(isValid) {
            return loginArr[0];
        } else {
            res.status(400).json('username or password not found');
        }
    }).then(login => {
        db('users').returning('*').select('*').where('email', login.email)
        .then(userArr => res.status(200).json(userArr[0]))
        .catch(err => res.status(400).json('username or password not found'))
    }).catch(err => res.status(400).json('username or password not found'))
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password, bcryptSaltRounds);

    db.transaction(trx => {
        return trx('login').returning('email')
        .insert({
            email: email,
            hash: hash
        }).catch(err => res.status(500).json(`couldn't create password`))
        .then((emailArr) => {
            return trx('users').returning('*').insert({
                name: name,
                email: emailArr[0].email,
                entries: 0,
                joined: new Date()
            })
        }).then(usersArr => res.status(200).json(usersArr[0]))
        .catch(err => res.status(500).send(err))
        .then(trx.commit)
        .catch(trx.rollback)
    })
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