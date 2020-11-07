const db = require('../db');
const {checkMoveToSeedling} = require('../tasks/germinating');

function parseMention(mention) {
  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }
    return mention;
  }
}

module.exports = {
  name: 'user',
  secret: true,
  mod: true,
  args: true,
  handler: ({channel, client}, [mode, ...args]) => {
    if (mode === 'check') {
      if(!args[0])
        return channel.send('Invalid user');
      const user = client.users.cache.get(parseMention(args[0]));
      return channel.send(db.get(user.id)); //TODO: Fix this function
    } else if (mode === 'update') {
      const [property, user] = args;
      return checkMoveToSeedling(user, property); 
    }
  }
};