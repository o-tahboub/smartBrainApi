export const imageHandler = (req, res, db) => {
    const { id } = req.body
    db('users').where({id}).increment('entries').returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(err => res.status(500).json('could not update entries'));
}
