const Accounts = require('./accounts-model')
const db = require('../../data/db-config')


// Returns a status 400 with if req.body is invalid:
//  * If either name or budget are undefined, return { message: "name and budget are required" }
//  * If the trimmed name is shorter than 3 or longer than 100, return { message: "name of account must be between 3 and 100" }
//  * If budget is not able to be converted into a number, return { message: "budget of account must be a number" }
//  * If budget is a negative number or over one million, return { message: "budget of account is too large or too small" }
// Note: you can either write "manual" validation logic
// or use the Yup library (not currently installed)
exports.checkAccountPayload = (req, res, next) => {
  const {name, budget} = req.body
  if (name === undefined || budget === undefined) next({ status:400, message: "name and budget are required" })
  if (name.trim() < 3 || name.trim() > 100) next({ status:400, message: "name of account must be between 3 and 100" })
  if (isNaN(Number(budget))) next({ status:400, message: "budget of account must be a number"})
  if (budget < 0 || budget > 1000000) next({ status:400, message: "budget of account is too large or too small"})
  next()
}

// Returns a status 404 with a { message: "account not found" } if req.params.id does not exist in the database
exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const existAccount = await db('accounts').where('name', req.body.name.trim()).first()
    if (existAccount) {
      next({ status:404, message: "account not found" })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

// Returns a status 400 with a { message: "that name is taken" } if the trimmed req.body.name already exists in the database 
exports.checkAccountId = async(req, res, next) => {
  try {
    const account = await Accounts.getById(req.params.id)
    if(account) {
      req.account = account
      next()
    } else {
      next({ status:400, message: "that name is taken" })
    }
  } catch (err) {
    next(err)
  }
}
