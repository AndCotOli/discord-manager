module.exports = {
  name: 'help',
  triggers: ['commands'],
  description: 'Get info about all the commands',
  handler(message) {
    const { commands } = message.client;

    return message.channel.send(commands.array().reduce((desc, cmd) => {
      if(cmd.secret) return desc;
      desc += `**${cmd.name}** - ${cmd.description} \nUsage: ${cmd.triggers ? cmd.triggers.map(t => '!' + t).join(' or ') : ''} ${cmd.example || ''}\n`;
      return desc;
    }, ''));
  }
};