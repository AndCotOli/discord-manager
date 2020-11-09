const db = require('../db');

module.exports = {
  name: 'dbTest',
  description: 'Test the DB',
  handler: () => {
    console.log(db.find());
  }
};
