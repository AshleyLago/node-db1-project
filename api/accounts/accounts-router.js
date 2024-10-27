const router = require('express').Router()
const Accounts = require('./accounts-model')

const {checkAccountId, checkAccountNameUnique, checkAccountPayload} = require('./accounts-middleware')

// Returns an array of accounts (or an empty array if there aren't any).
router.get('/', (req, res, next) => {
  Accounts.getAll()
    .then(acc => {
      res.status(200).json(acc)
    })
    .catch(next)
})
/* Alternate:
  router.get('/', async (req, res, next) => {
    try {
      const acc = await Accounts.getAll()
      res.status(200).json(acc)
    } catch (err) {
      next(err)
    }
  })
*/

// Returns an account by the given id.
router.get('/:id', checkAccountId, (req, res) => {
  res.status(200).json(req.account)
})
/* Alternate:
router.get('/:id', checkAccountId, async(req, res, next) => {
  try {
      const account = await Accounts.getById(req.params.id)
      res.json(account)
    } catch (err) {
      next(err)
    }
})
*/

// Returns the created account. Leading or trailing whitespace on budget name should be trimmed before saving to db.
router.post('/', checkAccountPayload, checkAccountNameUnique, (req, res, next) => {
  Accounts.create({ name: req.body.name.trim(), budget: req.body.budget })
    .then(acc => {
      res.status(201).json(acc);
    })
    .catch(next);
})
/* Alternate:
  router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
    try {
      const newAcc = await Accounts.create({ name: req.body.name.trim(), budget: req.body.budget })
      res.status(201).json(newAcc)
    } catch (err) {
      next(err)
    }
  })
*/

// Returns the updated account. Leading or trailing whitespace on budget name should be trimmed before saving to db.
router.put('/:id', checkAccountId, checkAccountPayload, (req, res, next) => {
  Accounts.updateById(req.params.id, req.body)
    .then(upAcc => {
      res.status(200).json(upAcc)
    })
    .catch(next)
});
/* Alternate:
  router.put('/:id', checkAccountId, checkAccountPayload, async(req, res, next) => {
    try {
      const updated = await Accounts.updateById(req.params.id, req.body)
      res.json(updated)
    } catch(err) {
      next(err)
    }
  });
*/

// Returns the deleted account.
router.delete('/:id', checkAccountId, (req, res, next) => {
  Accounts.deleteById(req.params.id)
    .then(() => {
      res.json(req.user)
    })
    .catch(next)
})
/* Alternate:
  router.delete('/:id', checkAccountId, async(req, res, next) => {
    try {
      await Accounts.deleteById(req.params.id)
      res.json(req.user)
    } catch (err) {
      next(err)
    }
  })
*/

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({ message: err.message })
})

module.exports = router;
