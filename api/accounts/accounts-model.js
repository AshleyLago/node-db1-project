const db = require('../../data/db-config')

// Resolves to an array of accounts (or an empty array)
const getAll = () => {
  return db('accounts');
}

// Resolves to an account by the given id
const getById = id => {
  return db('accounts').where( "id", id ).first();
}

// Resolves to the newly created account
const create = async account => {
  const [id] = await db('accounts').insert(account);
  return getById(id);
}

// Resolves to the updated account
const updateById = async(id, account) => {
  await db('accounts').where('id', id).update(account);
  return getById(id)
}

// Resolves to the deleted account
const deleteById = id => {
  return db('accounts').where('id', id).del();
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
