import express, { json } from 'express'
const app = express()
const port = 3000
app.use(express.json())

const database = {
    users: [
        {
            id: '123',
            name: 'Josh',
            email: 'josh@fictional.com',
            password: 'potatoes',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Julie',
            email: 'julie@fictional.com',
            password: 'carrots',
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
    if(email === database.users[0].email &&
        password === database.users[0].password) {
            res.send('signed in')
        } 
    res.status(400).send('sign in failed')
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    database.users.push({
        id: '124',
        name: name,
        email: email,
        password: password,
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