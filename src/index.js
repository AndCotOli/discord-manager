const fs = require('fs');
const path = require('path');

const {
  BOT_TOKEN,
  INTRODUCTION_CHANNEL_ID,
  GUILD_ID,
  DEBUGGING_COMMAND,
  MOD_ROLE_ID,
} = require('./config');

const germinating = require('./tasks/germinating');
const db = require('./db');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

if (DEBUGGING_COMMAND) {
  console.log('DEBUGGING', DEBUGGING_COMMAND, 'command.');
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!DEBUGGING_COMMAND && guild.id === GUILD_ID) {
    germinating.listenCodeOfConductReactions(guild);
    console.log('Adding missing germinators...');
    try {
      await germinating.addMissingGerminators(guild);
    } catch (error) {
      console.error(error);
    }
  }

  // Add commands
  const commandFiles = fs
    .readdirSync(path.join(__dirname, './commands'))
    .filter((file) => file.endsWith('.js'));

  for (let file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
});

client.on('guildMemberAdd', async (member) => {
  if (!DEBUGGING_COMMAND && member.guild.id === GUILD_ID) {
    try {
      await germinating.moveToGerminating(member);
    } catch (error) {
      console.log('Error while moving to germinating:');
      console.error(error.message);
      console.error(error);
      console.error(error.stack);
    }
  }
});

client.on('guildMemberRemove', async (member) => {
  if (!DEBUGGING_COMMAND && member.guild.id === GUILD_ID) {
    await db.remove({
      _id: member.id,
    });
  }
});

client.on('message', async (message) => {
  const { guild, channel, author, member } = message;
  if (author.bot || channel.type === 'dm') return;


  if (guild && guild.id === GUILD_ID) {
    if (!DEBUGGING_COMMAND && channel.id === INTRODUCTION_CHANNEL_ID) {
      germinating.checkIntroMessage(message, guild, author);
    } else if (message.content.startsWith('!')) {
      const args = message.content.slice(1).split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName) || client.commands.find(
        cmd => cmd.triggers && cmd.triggers.includes(commandName)
      );

      if (!command) return;

      if (command.args && !args.length)
        return message.reply('You didn\'t provide any arguments');

      if (command.mod && !member.roles.has(MOD_ROLE_ID))
        return message.reply('You must be a gardener to use this command');

      try {
        command.handler(message, args);
      } catch (e) {
        console.log(`An error ocurred running a command:\n${e}`);
      }
    }
  }
});

client.login(BOT_TOKEN);

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection:', error.message);
  console.error(error);
});