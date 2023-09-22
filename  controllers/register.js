export const registerHandler = (req, res, bcrypt, saltRounds, db,) => {
    const {name, email, password} = req.body;
    
    if(!inputIsValid(name, email, password)) {
        return res.status(400).json('enter a valid name, email and password')
    }

    const hash = bcrypt.hashSync(password, saltRounds);

    db.transaction(trx => {
        return trx('login').returning('email')
        .insert({
            email: email,
            hash: hash
        }).catch(err => {throw new Error(`registration failed, please contact administrator`)})
        .then((emailArr) => {
            return trx('users').returning('*').insert({
                name: name,
                email: emailArr[0].email,
                entries: 0,
                joined: new Date()
            })
            .catch(err => {throw new Error(`registration failed, please contact administrator`)})
        }).then(usersArr => res.status(200).json(usersArr[0]))
        .catch(err => res.status(500).json(`registration failed, please contact administrator`))
        
        .then(trx.commit)
        .catch(trx.rollback)
    })
}

const inputIsValid = (name, email, password) => {
    if((name && email && password) &&
    (password.length > 7)) {
        return true
    }
    return false
}
