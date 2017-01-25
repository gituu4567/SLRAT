/* eslint-env mocha */
const assert = require('assert')
import Database from '../../src/Database/main.js'

describe('createTables', () => {
  let config = {
    filename: ':memory:'
  }
  let database
  let tables

  before((done) => {
    database = new Database(config)
    database.createTables()
    .then(() => {
      let db = database.instance
      db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, rows) => {
        if (err) throw err
        tables = rows
        done()
      })
    })
  })
  after(() => {
    database.close()
  })
  it('should create validusers table', () => {
    assert(tables.find((v) => v.name === 'validusers'))
  })
  it('should create users table', () => {
    assert(tables.find((v) => v.name === 'users'))
  })
  it('should create authcodes table', () => {
    assert(tables.find((v) => v.name === 'authcodes'))
  })
  it('should create activationcodes table', () => {
    assert(tables.find((v) => v.name === 'activationcodes'))
  })
})
