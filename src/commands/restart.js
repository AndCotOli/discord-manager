const {exec} = require('child_process');

module.exports = {
  name: 'restart',
  description: 'Restart the bot',
  secret: true,
  mod: true,
  handler: () => {
    console.log('Restarting...');
    exec('forever restart 0');
  }
};