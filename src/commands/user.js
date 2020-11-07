const db = require('../db');
const {checkMoveToSeedling} = require('../tasks/germinating');

module.exports = {
  name: 'user',
  secret: true,
  mod: true,
  args: true,
  handler: ({channel}, [mode, ...args]) => {
    if (mode === 'check') {
      const user = args[0];
      return channel.send(db[user.id]);
    } else if (mode === 'update') {
      const [property, user] = args;
      return checkMoveToSeedling(user, property); 
    }
  }
};