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