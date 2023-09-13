export const signinHandler = (req, res, bcrypt, db) => {
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
}
