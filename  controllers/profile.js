export const getProfileHandler = (req, res, db) => {
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
}
