require('dotenv').config();

const { Client, WebhookClient } = require('discord.js');
const client = new Client();
const PREFIX = '$';

client.on('ready', () => {
    console.log(`${client.user.username}:${client.user.id} has logged in...`);
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
);

client.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)){
        const [cmd_name, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);
        if(cmd_name == 'kick'){
            if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply("You don't have the permission to kick...");
            if(args.length == 0) return message.reply('Please provide an id');
            const member = message.guild.members.cache.get(args[0]);
            if(member) member.kick().then(member => `${member} was kicked out...`).catch(err => message.channel.send("I don't have the permissions..."));
            else message.channel.send('Memeber not found');
        }else if(cmd_name == 'ban'){
            if(!message.member.hasPermission('BAN_MEMBERS')) return message.reply("You don't have the permission to ban...");
            if(args.length == 0) return message.reply('Please provide an id');
            try{
                const user = await message.guild.members.ban(args[0]);
                message.channel.send('User was banned successfully...');
            }catch(e){
                message.channel.send('An error occured...');
            }
        }else if(cmd_name == 'announce'){
            const msg = args.join(' ');
            webhookClient.send(msg);
        }
    }
    console.log(message.author.id)
    // console.log(`[${message.author.tag}] typed: ${message.content}`);
    if(message.content.toLowerCase().split(' ').includes('hello')) message.reply('Hello there!'); //message.channel.send('...')
});

client.login(process.env.DISCORDJS_BOT_TOKEN);

