export const registerHandler = (req, res, bcrypt, saltRounds, db,) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);

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
}
