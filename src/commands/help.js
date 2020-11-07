module.exports = {
  name: 'help',
  triggers: ['commands'],
  description: 'Get info about all the commands',
  handler(message) {
    const { commands } = message.client;

    return message.channel.send(commands.reduce((desc, cmd) => {
      desc += `**${cmd.name}** - ${cmd.description}
      Usage: ${cmd.triggers.map(t => '!' + t).join(' or ')} ${cmd.example || ''}
      
      `;
    }, ''));
  }
};